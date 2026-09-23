import type { PipelineStage } from '../types/rag'

export const STAGES: PipelineStage[] = [
  { id: 'pdf', label: 'PDF' },
  { id: 'parser', label: 'Parser' },
  { id: 'chunks', label: 'Chunks' },
  { id: 'embed', label: 'Embeddings' },
  { id: 'vdb', label: 'Vector DB' },
  { id: 'retriever', label: 'Retriever' },
  { id: 'llm', label: 'LLM' },
]

export function PipelineView({ stages, doneStages }: { stages: string[]; doneStages: string[] }) {
  return (
    <div className="pipeline">
      <div className="pipeline-row">
        {STAGES.map((s, i) => {
          const cls = ['node']
          if (stages.includes(s.id)) cls.push('active')
          if (doneStages.includes(s.id)) cls.push('done')
          return (
            <div key={s.id} className={cls.join(' ')}>
              <div className="dot mono">{i + 1}</div>
              <div className="label">{s.label}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
