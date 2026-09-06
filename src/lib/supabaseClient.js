import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase לא מוגדר — הגדר VITE_SUPABASE_URL ו-VITE_SUPABASE_ANON_KEY בקובץ .env (ראו .env.example). עד אז המסכים מוצגים עם נתוני דוגמה בלבד.'
  )
}

export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null
