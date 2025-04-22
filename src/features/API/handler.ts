import { NextApiRequest, NextApiResponse } from 'next';
import { setupRag as setUpRag } from '@/src/features/API/rag_setup';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await setUpRag();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error in RAG setup:', error);
    res.status(500).json({ success: false, error: 'Failed to set up RAG' });
  }
}