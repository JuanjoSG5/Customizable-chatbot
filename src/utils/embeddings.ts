import { Doc } from "@/src/types/doc";

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, v) => sum + v*v, 0));
  const normB = Math.sqrt(b.reduce((sum, v) => sum + v*v, 0));
  return dot / (normA * normB);
}

export function retrieve(docs: Doc[], queryEmb: number[], k = 3): Doc[] {
  return docs
    .map(doc => ({ doc, score: cosineSimilarity(doc.embedding, queryEmb) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map(item => item.doc);
}