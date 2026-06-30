import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const c = await supabase.from('categories').select('*').limit(1);
  console.log("Categories:", c.error ? c.error.message : "Exists");
  const b = await supabase.from('brands').select('*').limit(1);
  console.log("Brands:", b.error ? b.error.message : "Exists");
}
test();
