import fs from 'fs/promises';
import { pipeline } from '@xenova/transformers';


export async function loadTextFile(filePath: string): Promise<string> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return content.trim();
    } catch (err) {
      console.error(`❌ Error leyendo archivo "${filePath}":`, err);
      return '';
    }
  }
  
// Función para generar embedding local
export async function getEmbedding(text: string): Promise<number[]> {
    const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    const output = await extractor(text, {
        pooling: 'mean',
        normalize: true,
    });
    return Array.from(output.data);
}