import { createClient } from '@supabase/supabase-js'
import { crawlUrl } from '@/src/utils/clawler';

const supabase = createClient(`${process.env.NEXT_PUBLIC_DATABASE}`, `${process.env.NEXT_PUBLIC_DATABASE_KEY}`)

export default async function handler(req, res) {
    const { url } = req.body;
  
    try {
      console.log("Received URL:", url);
      const response = await crawlUrl(url);
      const markdown = response["data"][0]["markdown"]

      console.log("Response from crawlUrl:", response);
  
      const { error } = await supabase.from("articles").insert({ markdown });
  
      if (error) throw error;
  
      res.status(200).json({ message: "Scraped and saved!" });
    } catch (err) {
      res.status(500).json({ message: "Failed", error: err.message });
    }
  }