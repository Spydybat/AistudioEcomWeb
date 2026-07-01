import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import crypto from 'crypto';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testSignUp() {
  const email = `test_user_cart_${crypto.randomBytes(4).toString('hex')}@gmail.com`;
  const password = "StrongPassword123!";
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });
  
  if (error) {
    console.error("Sign up error:", error.message);
  } else {
    console.log("Sign up success:", data.user?.id);
  }
}

testSignUp();
