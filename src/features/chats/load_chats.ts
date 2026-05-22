import { supabase } from "@/src/utils/supabase";

export async function loadChats() {
    const { data, error } = await supabase
        .from("chats")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error al cargar los chats:", error);
        throw error;
    }
    
    return data;
}