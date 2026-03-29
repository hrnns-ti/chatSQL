import { supabase } from "../net/supabase.js";

export async function getSchema() {
  const { data, error } = await supabase.rpc('get_schema_metadata')
  return data
}