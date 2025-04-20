import fs from 'fs/promises';
import { pipeline } from '@xenova/transformers';

interface Doc {
  id: string;
  text: string;
  embedding: number[];
}

// 1. Cargar y procesar documentos
export async function loadDocuments(folder: string): Promise<Doc[]> {
  const files = await fs.readdir(folder);
  const docs: Doc[] = [];
  const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2'); // Modelo S-BERT :contentReference[oaicite:4]{index=4}

  for (const file of files.filter(f => f.endsWith('.txt'))) {
    const text = await fs.readFile(`${folder}/${file}`, 'utf-8');
    const output = await extractor(text, { pooling: 'mean', normalize: true });
    docs.push({ id: file, text, embedding: Array.from(output.data) });
  }

  return docs;
}

// 2. Similitud coseno
function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, v) => sum + v*v, 0));
  const normB = Math.sqrt(b.reduce((sum, v) => sum + v*v, 0));
  return dot / (normA * normB);
}

// 3. Recuperar top-K documentos
export function retrieve(docs: Doc[], queryEmb: number[], k = 3): Doc[] {
  return docs
    .map(doc => ({ doc, score: cosineSimilarity(doc.embedding, queryEmb) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map(item => item.doc);
}