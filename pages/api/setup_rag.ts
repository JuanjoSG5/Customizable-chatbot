import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js'
import { setupRag } from '@/src/features/Chatbot/create_rag';


const supabase = createClient(`${process.env.NEXT_PUBLIC_DATABASE}`, `${process.env.NEXT_PUBLIC_DATABASE_KEY}`)

export default async function setup_rag(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("markdown")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    
    
    if (error) throw error;
    
    const { chain, model } = await setupRag(data.markdown);
      
    res.status(200).json({ success: true, chain: chain, model: model });
  } catch (error) {
    console.error('Error fetching markdown:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch markdown' });
  }
}