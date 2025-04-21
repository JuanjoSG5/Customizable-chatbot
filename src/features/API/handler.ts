import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';
import { pipeline } from '@xenova/transformers';
import { Doc } from "@/src/types/doc";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const folderPath = path.join(process.cwd(), 'data');
    const files = await fs.readdir(folderPath);
    const docs: Doc[] = [];
    
    const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

    for (const file of files.filter(f => f.endsWith('.txt'))) {
      const text = await fs.readFile(path.join(folderPath, file), 'utf-8');
      const output = await extractor(text, { pooling: 'mean', normalize: true });
      docs.push({ id: file, text, embedding: Array.from(output.data) });
    }

    res.status(200).json(docs);
  } catch (error) {
    console.error('Error loading documents:', error);
    res.status(500).json({ error: 'Failed to load documents' });
  }
}