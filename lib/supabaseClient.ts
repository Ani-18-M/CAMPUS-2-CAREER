import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://aqvlwrzfipzpynbuwgkl.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxdmx3cnpmaXB6cHluYnV3Z2tsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5Mjk2MjksImV4cCI6MjEwNzUwNTYyOX0.bqBSS7EFtXLL5eYFF8I4tvmE-PjPciYoVs2PAiNl-lA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
