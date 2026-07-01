import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testCartItemsCols() {
  const userId = '52882dba-d9cf-4464-b473-3135b14764c8';
  
  const { data: carts } = await supabase.from('carts').select('id').eq('profile_id', userId);
  const cartId = carts[0].id;
  const { data: products } = await supabase.from('products').select('id').limit(1);
  const productId = products[0].id;
  
  let dummyItem = {
     cart_id: cartId,
     product_id: productId,
     quantity: 1,
     selected_size: 'M',
     selected_color: 'Red'
  };
  
  for(let i=0; i<10; i++) {
     const { error: insertErr } = await supabase.from('cart_items').insert([dummyItem]);
     if (insertErr) {
        if (insertErr.message.includes('Could not find the')) {
           const match = insertErr.message.match(/Could not find the '([^']+)'/);
           if (match) {
              console.log(`Removing ${match[1]}`);
              delete dummyItem[match[1]];
           }
        } else {
           console.log("Other Error:", insertErr.message);
           break;
        }
     } else {
        console.log("Success! Columns are:", Object.keys(dummyItem));
        // clean up
        await supabase.from('cart_items').delete().eq('cart_id', cartId);
        break;
     }
  }
}
testCartItemsCols();
