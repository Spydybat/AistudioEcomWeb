import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import crypto from 'crypto';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testSignUp() {
  const email = `anon_${crypto.randomBytes(8).toString('hex')}@example.com`;
  const password = crypto.randomBytes(16).toString('hex');
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });
  
  if (error) {
    console.error("Sign up error:", error.message);
  } else {
    console.log("Sign up success:", data.user?.id);
    
    // Check if profile was created
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id);
    console.log("Profile auto-created:", profile);
    
    if(!profile || profile.length === 0) {
        const { error: pErr } = await supabase.from('profiles').insert([{ id: data.user.id }]);
        console.log("Profile manually created error:", pErr?.message || "Success");
    }
    
    // Test cart
    const { error: cartErr } = await supabase.from('carts').insert([{ profile_id: data.user.id }]);
    console.log("Cart insert error:", cartErr?.message || "Success");
  }
}

testSignUp();
