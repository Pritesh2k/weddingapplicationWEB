// DB/client.ts — this is correct, do not change
import { createClient } from '@supabase/supabase-js'
import { auth } from '@/Auth/client'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  accessToken: async () => {
    return await auth.currentUser?.getIdToken(false) ?? null
  },
})