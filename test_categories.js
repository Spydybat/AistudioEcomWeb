import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8');
const urlMatch = env.match(/VITE_SUPABASE_URL=(.+)/);
const keyMatch = env.match(/VITE_SUPABASE_ANON_KEY=(.+)/);
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function checkCategories() {
  const { data } = await supabase.from('categories').select('*').limit(2);
  console.log('Categories:', JSON.stringify(data, null, 2));
}
checkCategories();
