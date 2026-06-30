import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function getColumns(table) {
  const { data, error } = await supabase.from(table).select('*').limit(1);
  if (error) {
    console.log(`Table ${table} error:`, error.message);
  } else {
    // If empty, we can try inserting a row and observing errors to guess schema, or using a known UUID
    console.log(`Table ${table} exists. Rows: ${data.length}`);
  }
}

async function run() {
  await getColumns('products');
  await getColumns('profiles');
  await getColumns('categories');
}
run();
