import { createClient } from "@supabase/supabase-js"

// These would typically come from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-supabase-url.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-supabase-anon-key"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Google OAuth URL helper
export const signInWithGoogle = async (redirectTo?: string) => {
  const redirectURL = redirectTo ? `${window.location.origin}${redirectTo}` : `${window.location.origin}/`

  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectURL,
    },
  })
}

