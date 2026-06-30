import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkTables() {
  const tables = ['products', 'orders', 'customers', 'reviews', 'profiles', 'users', 'categories', 'items'];
  console.log("Checking tables...");
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      if (error.code === 'PGRST205') {
        // Table not found in schema
        console.log(`Table '${table}': Missing`);
      } else {
        console.log(`Table '${table}': Error - ${error.message}`);
      }
    } else {
      console.log(`Table '${table}': EXISTS. Columns:`, data.length > 0 ? Object.keys(data[0]).join(', ') : 'No rows, but table exists');
    }
  }
}

checkTables();
