import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('orders').insert([{
    profile_id: 'df5446b3-58b1-4444-bf1a-3b693b691fc9',
    order_number: 'TEST-123',
    total: 10,
    status: 'pending',
    payment_status: 'pending',
    payment_method: JSON.stringify({ method: 'razorpay', payment_id: 'pay_123', order_id: 'order_123', signature: 'sig_123' })
  }]).select();
  console.log('Insert result:', data, error);
}
check();
