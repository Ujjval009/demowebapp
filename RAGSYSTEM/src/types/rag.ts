export interface Chunk {
  id: string
  text: string
  vector: Record<string, number>
}

export interface ScoredChunk {
  id: string
  text: string
  score: number
}

export interface PipelineStage {
  id: string
  label: string
}

export interface RetrievalResult {
  topChunks: ScoredChunk[]
  queryVector: Record<string, number>
  totalChunks: number
}

export interface RAGState {
  stages: string[]
  doneStages: string[]
  chunks: Chunk[]
  retrievalResult: RetrievalResult | null
  answer: string | null
  citations: string[]
  isLoading: boolean
}
