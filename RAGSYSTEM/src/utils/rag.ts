const STOPWORDS = new Set([
  "a","an","the","is","are","was","were","be","been","being","of","to","in","on",
  "for","with","and","or","but","if","then","this","that","these","those","it",
  "its","as","by","at","from","into","over","under","up","down","out","about",
  "not","no","can","may","will","would","should","must","have","has","had","do",
  "does","did","i","we","you","they","he","she"
])

export function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9%$]+/g) || []).filter(
    (t) => t.length > 2 && !STOPWORDS.has(t)
  )
}

export function vectorize(text: string): Record<string, number> {
  const toks = tokenize(text)
  const v: Record<string, number> = {}
  toks.forEach((t) => { v[t] = (v[t] || 0) + 1 })
  return v
}

export function topTerms(v: Record<string, number>, n: number): string[] {
  return Object.keys(v)
    .sort((a, b) => v[b] - v[a])
    .slice(0, n)
}

export function cosineSim(a: Record<string, number>, b: Record<string, number>): number {
  let dot = 0, na = 0, nb = 0, k: string
  for (k in a) { na += a[k] * a[k]; if (b[k]) dot += a[k] * b[k] }
  for (k in b) { nb += b[k] * b[k] }
  if (na === 0 || nb === 0) return 0
  return dot / (Math.sqrt(na) * Math.sqrt(nb))
}

export function splitParagraphs(text: string): string[] {
  return text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
}

export function chunkDocument(text: string, targetLen = 320): string[] {
  const paras = splitParagraphs(text)
  const chunks: string[] = []
  paras.forEach((para) => {
    const sentences = para.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [para]
    let buf = ''
    sentences.forEach((sent) => {
      sent = sent.trim()
      if (!sent) return
      if ((buf + ' ' + sent).trim().length > targetLen && buf) {
        chunks.push(buf.trim())
        buf = sent
      } else {
        buf = (buf ? buf + ' ' : '') + sent
      }
    })
    if (buf.trim()) chunks.push(buf.trim())
  })
  return chunks
}
