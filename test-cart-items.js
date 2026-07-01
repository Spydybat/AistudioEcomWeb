import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import crypto from 'crypto';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
const getUUID = () => crypto.randomUUID();

async function testCartItems() {
  const userId = '52882dba-d9cf-4464-b473-3135b14764c8';
  
  // Get cart_id
  const { data: carts } = await supabase.from('carts').select('id').eq('profile_id', userId);
  if (!carts || carts.length === 0) return console.log("No cart");
  const cartId = carts[0].id;
  
  // Get a product_id
  const { data: products } = await supabase.from('products').select('id').limit(1);
  if (!products || products.length === 0) return console.log("No products");
  const productId = products[0].id;
  
  // Try inserting cart_items
  const dummyItem = {
     cart_id: cartId,
     product_id: productId,
     quantity: 1,
     size: 'M',
     color: 'Red'
  };
  
  const { error: insertErr } = await supabase.from('cart_items').insert([dummyItem]);
  if (insertErr) {
     console.log("Insert error:", insertErr);
     if(insertErr.code === '23502') {
         console.log("Missing Not Null:", insertErr.message);
     } else if (insertErr.message.includes('Could not find the')) {
         console.log("Missing column:", insertErr.message);
     }
  } else {
     console.log("Insert cart_items success!");
  }
}
testCartItems();
