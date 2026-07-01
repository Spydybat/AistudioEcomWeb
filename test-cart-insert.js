import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testCart() {
  const userId = '52882dba-d9cf-4464-b473-3135b14764c8';
  
  // Is profile automatically created?
  const { data: profiles } = await supabase.from('profiles').select('*').eq('id', userId);
  console.log("Profiles for user:", profiles);
  
  if (profiles.length === 0) {
      const { error: pErr } = await supabase.from('profiles').insert([{ id: userId }]);
      console.log("Profile insert:", pErr?.message || "Success");
  }
  
  // Insert cart
  const { error: cartErr } = await supabase.from('carts').insert([{ profile_id: userId }]);
  console.log("Cart insert:", cartErr?.message || "Success");
  
  // Insert wishlist
  const { error: wishErr } = await supabase.from('wishlists').insert([{ profile_id: userId }]);
  console.log("Wishlist insert:", wishErr?.message || "Success");
}

testCart();
