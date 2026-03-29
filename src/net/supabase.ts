// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("🛑 FATAL ERROR: SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY tidak ditemukan!");
}

export const supabase = createClient(supabaseUrl, supabaseKey);