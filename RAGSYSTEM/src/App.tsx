import { useState } from 'react'
import { getSample, getSampleDoc } from './utils/sample'
import { chunkDocument, vectorize, cosineSim, topTerms } from './utils/rag'
import type { Chunk, ScoredChunk } from './types/rag'
import { PipelineView } from './components/Pipeline'

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

function escapeHtml(s: string): string {
  const d = document.createElement('div')
  d.textContent = s
  return d.innerHTML
}

export default function App() {
  const [stages, setStages] = useState<string[]>(['pdf'])
  const [doneStages, setDoneStages] = useState<string[]>([])
  const [chunks, setChunks] = useState<Chunk[]>([])
  const [answer, setAnswer] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [docText, setDocText] = useState(getSampleDoc())
  const [showAsk, setShowAsk] = useState(false)
  const [retrievalNote, setRetrievalNote] = useState<string>('')
  const [question, setQuestion] = useState('')

  const advanceStage = async (activeIds: string[], doneIds: string[], note?: string) => {
    setStages(activeIds)
    setDoneStages(doneIds)
    if (note) setRetrievalNote(note)
    await sleep(note ? 350 : 300)
  }

  const handleIngest = async () => {
    const text = docText.trim()
    if (!text) { setRetrievalNote('Paste some text first.'); return }
    setIsLoading(true)
    setChunks([])
    setShowAsk(false)
    const grid = document.getElementById('chunkGrid')
    if (grid) grid.innerHTML = ''

    await advanceStage(['parser'], ['pdf'], 'Parsing document…')
    const rawChunks = chunkDocument(text)

    await advanceStage(['chunks'], ['pdf', 'parser'], `Splitting into ${rawChunks.length} chunks…`)
    await advanceStage(['embed'], ['pdf', 'parser', 'chunks'], 'Computing term vectors…')

    const chunkList: Chunk[] = rawChunks.map((c, i) => ({
      id: 'chunk_' + String(i + 1).padStart(2, '0'),
      text: c,
      vector: vectorize(c),
    }))
    setChunks(chunkList)

    await advanceStage(['vdb'], ['pdf', 'parser', 'chunks', 'embed'], `Storing ${chunkList.length} vectors in the index…`)
    renderChunkCards(chunkList)
    setRetrievalNote('')
    setDoneStages(['pdf', 'parser', 'chunks', 'embed', 'vdb'])
    setStages([])
    setIsLoading(false)
    setShowAsk(true)
    setQuestion('')
  }

  const runQuery = async (q?: string) => {
    const query = (q || question).trim()
    if (!query || !chunks.length) return
    setIsLoading(true)
    setAnswer(null)
    const retrievalEl = document.getElementById('retrievalOut')
    const answerEl = document.getElementById('answerBox')
    const citEl = document.getElementById('citationsOut')
    if (retrievalEl) retrievalEl.innerHTML = ''
    if (answerEl) { answerEl.style.display = 'none'; answerEl.innerHTML = '' }
    if (citEl) citEl.innerHTML = ''

    await advanceStage(['retriever'], ['pdf', 'parser', 'chunks', 'embed', 'vdb'])

    const qVec = vectorize(query)
    const scored: ScoredChunk[] = chunks
      .map((c) => ({ id: c.id, text: c.text, score: cosineSim(qVec, c.vector) }))
      .sort((a, b) => b.score - a.score)

    const top = scored.slice(0, 3).filter((s) => s.score > 0)
    const rMap: Record<string, number> = {}
    top.forEach((t) => { rMap[t.id] = t.score })
    renderChunkCards(chunks, rMap)

    if (retrievalEl) {
      const note = document.createElement('p')
      note.className = 'status-line mono'
      note.style.marginTop = '4px'
      note.textContent = top.length
        ? `Top ${top.length} chunk(s) retrieved by cosine similarity — scroll up to see them highlighted.`
        : 'No chunk scored above zero for this question.'
      retrievalEl.appendChild(note)
    }

    await sleep(300)
    await advanceStage(['llm'], ['pdf', 'parser', 'chunks', 'embed', 'vdb', 'retriever'])

    if (answerEl) {
      answerEl.style.display = 'block'
      answerEl.innerHTML = '<span class="thinking mono">Generating answer from retrieved context…</span>'
    }

    const context = top.map((t) => `[${t.id}] ${t.text}`).join('\n\n')
    const prompt = `You are a company knowledge assistant. Answer the QUESTION using ONLY the CONTEXT chunks below. ` +
      `If the context does not contain the answer, say plainly that the knowledge base does not cover it — do not guess. ` +
      `Cite the chunk id(s) you used in square brackets at the end of relevant sentences, like [chunk_02].\n\n` +
      `CONTEXT:\n${context || '(no chunks retrieved)'}\n\nQUESTION: ${query}`

    const sample = await getSample()
    if (!sample) {
      if (answerEl) answerEl.innerHTML = 'Live generation isn\u2019t available in this view — but the retrieval step above is real.'
      setDoneStages(['pdf', 'parser', 'chunks', 'embed', 'vdb', 'retriever'])
      setStages([])
      setIsLoading(false)
      return
    }

    try {
      const result = await sample(prompt, {
        modelTier: 'default',
        onText: (evt: { text: string }) => {
          const el = document.getElementById('answerBox')
          if (el) el.textContent = evt.text
        }
      })
      const el = document.getElementById('answerBox')
      if (el) el.textContent = result.text
      if (top.length && citEl) {
        citEl.textContent = 'Retrieved: ' + top.map((t) => `${t.id} (${t.score.toFixed(2)})`).join('  ·  ')
      }
      setDoneStages(['pdf', 'parser', 'chunks', 'embed', 'vdb', 'retriever', 'llm'])
      setStages([])
    } catch (err: any) {
      const el = document.getElementById('answerBox')
      if (el) el.textContent = `The model call didn\u2019t complete (${err?.code || 'error'}).`
    }
    setIsLoading(false)
  }

  const renderChunkCards = (list: Chunk[], retrieved?: Record<string, number>) => {
    const grid = document.getElementById('chunkGrid')
    if (!grid) return
    grid.innerHTML = ''
    list.forEach((c) => {
      const card = document.createElement('div')
      const isRetrieved = retrieved && retrieved[c.id] !== undefined
      if (isRetrieved) card.classList.add('retrieved')
      let scoreHtml = ''
      if (isRetrieved) {
        scoreHtml = `<span class="score">sim ${retrieved[c.id].toFixed(2)}</span>`
      }
      const preview = c.text.length > 150 ? c.text.slice(0, 150) + '…' : c.text
      const terms = topTerms(c.vector, 5).join(' · ')
      card.className = 'chunk-card'
      if (isRetrieved) card.classList.add('retrieved')
      card.innerHTML = `
        <span class="chunk-id">${c.id} ${scoreHtml}</span>
        <p>${escapeHtml(preview)}</p>
        <div class="terms">${terms}</div>
      `
      grid.appendChild(card)
    })
  }

  const suggestedQs = [
    'How many PTO days do new hires get?',
    'What happens if the API error rate spikes?',
    'What does the Growth pricing tier include?',
    'Can I work fully remote?'
  ]

  return (
    <div className="wrap">
      <header>
        <p className="kicker mono">RAG SYSTEM — LIVE WALKTHROUGH</p>
        <h1>Company Knowledge AI</h1>
        <p className="lede">Paste a document, watch it get parsed and chunked, then ask it a question. Retrieval runs as real cosine similarity over term vectors; the answer comes from an actual language model call, grounded only in the chunks retrieved below.</p>
      </header>

      <PipelineView stages={stages} doneStages={doneStages} />

      <section id="ingestSection">
        <h2><span className="idx mono">01</span> Knowledge base</h2>
        <p className="section-note">This stands in for a PDF upload — the parser doesn't care where text comes from. Edit it, or ingest the sample company handbook as-is.</p>
        <textarea id="docInput" spellCheck={false} value={docText} onChange={(e) => setDocText(e.target.value)} />
        <div className="row">
          <button id="ingestBtn" onClick={handleIngest} disabled={isLoading}>Parse &amp; ingest</button>
          <button className="secondary" onClick={() => setDocText(getSampleDoc())}>Reset sample text</button>
          <span className="status-line mono">{retrievalNote}</span>
        </div>
        <div className="chunks" id="chunkGrid"></div>
      </section>

      {showAsk && (
        <section id="askSection">
          <hr className="rule" />
          <div style={{ marginTop: 52 }}>
            <h2><span className="idx mono">02</span> Ask a question</h2>
            <p className="section-note">The retriever scores every chunk against your question and hands the top matches to the model — nothing else is in its context.</p>
            <div className="ask-row">
              <input type="text" id="questionInput" placeholder="e.g. how many vacation days do I get?" value={question} onChange={(e) => setQuestion(e.target.value)} />
              <button id="askBtn" onClick={() => runQuery()} disabled={isLoading}>Ask</button>
            </div>
            <div className="suggested" id="suggestedQs">
              {suggestedQs.map((q) => (
                <button key={q} type="button" onClick={() => { setQuestion(q); runQuery(q); }}>{q}</button>
              ))}
            </div>
            <div id="retrievalOut"></div>
            <div className="answer-box" id="answerBox" style={{ display: 'none' }}></div>
            <div className="citations" id="citationsOut"></div>
          </div>
        </section>
      )}

      <footer className="mono">PDF → Parser → Chunks → Embeddings → Vector DB → Retriever → LLM. Built as a live demo, not a production pipeline.</footer>
    </div>
  )
}
