import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testAnon() {
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) {
    console.error("Anon sign in failed:", error.message);
  } else {
    console.log("Anon sign in success:", data.user?.id);
    
    // Check if a profile was auto-created
    const { data: profileData, error: profileError } = await supabase.from('profiles').select('*').eq('id', data.user.id);
    console.log("Profile data:", profileData);
    
    // If not, try to create one
    if (!profileData || profileData.length === 0) {
       const { error: insertErr } = await supabase.from('profiles').insert([{ id: data.user.id }]);
       console.log("Profile insert:", insertErr ? insertErr.message : "Success");
    }
    
    // Create cart
    const { error: cartErr } = await supabase.from('carts').insert([{ profile_id: data.user.id }]);
    console.log("Cart insert:", cartErr ? cartErr.message : "Success");
    
  }
}
testAnon();
