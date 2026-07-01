import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkSchema() {
  const tables = ['carts', 'cart_items', 'wishlists', 'wishlist_items'];
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    console.log(`\n--- ${table} ---`);
    if (error) {
      console.error("Error:", error.message);
    } else {
      console.log("Data sample:", data);
      
      // Alternatively, try to fetch empty structure
      const { data: emptyData, error: emptyError } = await supabase.from(table).select('*').limit(0);
      if (!emptyError && emptyData.length === 0 && emptyData.length != null) {
         // Unfortunately supabase doesn't return columns for empty sets easily. 
         // Let's rely on RPC or just looking at the columns if there's data.
      }
    }
  }
}
checkSchema();
