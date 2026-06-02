import { supabase } from "@/src/utils/supabase";

export const createNewChat = async (firstMessage?: string) => {

  const title = firstMessage 
    ? firstMessage.slice(0, 25) + (firstMessage.length > 25 ? "..." : "")
    : `Nuevo Chat ${new Date().toLocaleTimeString()}`;

  const { data, error } = await supabase
    .from('chats')
    .insert({ name: title })
    .select()
    .single();

  if (error) throw error;
  return data.id; 
};