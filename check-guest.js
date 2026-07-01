import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkGuest() {
  const dummy = { profile_id: '00000000-0000-0000-0000-000000000000' };
  const {error} = await supabase.from('carts').insert([dummy]);
  console.log("Error with zeros:", error);
}
checkGuest();
