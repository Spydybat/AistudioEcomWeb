import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkCartItemsSession() {
  const dummy = { session_id: 'test' };
  const {error} = await supabase.from('cart_items').insert([dummy]);
  console.log("Error:", error);
}
checkCartItemsSession();
