import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function discover(table) {
  let dummy = { non_existent_col_123: 1 };
  let maxAttempts = 10;
  for (let i = 0; i < maxAttempts; i++) {
    const { error } = await supabase.from(table).insert([dummy]).select();
    if (error) {
      const match = error.message.match(/Could not find the '([^']+)' column/);
      if (match) {
        delete dummy[match[1]];
      } else {
        console.log(`Table ${table} schema hint:`, error.message);
        break;
      }
    } else {
      console.log(`Table ${table} successfully inserted`, dummy);
      break;
    }
  }
}
async function run() {
  await discover('products');
  await discover('profiles');
  await discover('categories');
}
run();
