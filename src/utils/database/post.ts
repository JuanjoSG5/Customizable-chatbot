import { createClient } from '@supabase/supabase-js'

const supabase = createClient(`${process.env.NEXT_PUBLIC_DATABASE}`, `${process.env.NEXT_PUBLIC_DATABASE_KEY}`)

