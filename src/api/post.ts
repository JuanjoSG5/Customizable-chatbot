import { createClient } from '@supabase/supabase-js'
import { crawlUrl } from '@/src/utils/clawler';

const supabase = createClient(`${process.env.NEXT_PUBLIC_DATABASE}`, `${process.env.NEXT_PUBLIC_DATABASE_KEY}`)

const uploadFile = async (file: File) => {
    const markdown  = await crawlUrl(`${process.env.NEXT_PUBLIC_WEB_URL}`)
    console.log("Markdown fetched:", markdown);

    const { data, error } = await supabase.storage.from('markdown').upload(`markdown/${file.name}`, file, {
        cacheControl: '3600',
        upsert: false,
    })
}