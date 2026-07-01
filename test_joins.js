import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8');
const urlMatch = env.match(/VITE_SUPABASE_URL=(.+)/);
const keyMatch = env.match(/VITE_SUPABASE_ANON_KEY=(.+)/);
const supabaseUrl = urlMatch[1].trim();
const supabaseAnonKey = keyMatch[1].trim();

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testQuery() {
  const { data, error } = await supabase.from('products').select(`
      *,
      categories(slug),
      brands(slug)
  `).limit(1);

  if (error) {
    console.error('Error with full query:', error);
  } else {
    console.log('Successfully ran query. Data:', JSON.stringify(data, null, 2));
  }
}

testQuery();
