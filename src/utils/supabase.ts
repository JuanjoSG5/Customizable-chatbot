import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log("Supabase URL or Key is missing. Please check your environment variables.", { supabaseUrl, supabaseKey });
  throw new Error("Faltan las variables de entorno de Supabase.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);