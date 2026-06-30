import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data: cat } = await supabase.from('categories').select('*');
  const { data: br } = await supabase.from('brands').select('*');
  const { data: prodSchema } = await supabase.from('products').select('*').limit(1);
  console.log('Categories:', cat?.slice(0,2));
  console.log('Brands:', br?.slice(0,2));
  console.log('Product cols:', Object.keys(prodSchema?.[0] || {}));
}
run();
