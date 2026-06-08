import { supabase } from "@/src/utils/supabase";

export async function retrieve(queryEmb: number[], chatId: string, k = 3) {
  // Llamamos al Remote Procedure Call (RPC) de Supabase
  const { data, error } = await supabase.rpc('match_documents', {
    p_chat_id: chatId,
    query_embedding: queryEmb,
    match_count: k
  });

  if (error) {
    console.error("Error retrieving documents:", error);
    return[];
  }

  // data ya viene ordenado y solo trae los K mejores resultados
  return data; 
}