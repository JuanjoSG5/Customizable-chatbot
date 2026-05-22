import { supabase } from "@/src/utils/supabase";

export const createNewChat = async () => {
  const { data, error } = await supabase
    .from('chats')
    .insert({ name: `Nuevo Chat ${new Date().toLocaleTimeString()}` })
    .select()
    .single();

  if (error) throw error;
  return data.id; 
};