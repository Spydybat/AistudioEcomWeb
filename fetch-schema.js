import dotenv from 'dotenv';
dotenv.config();

async function getSchema() {
  const url = process.env.VITE_SUPABASE_URL + '/rest/v1/';
  const key = process.env.VITE_SUPABASE_ANON_KEY;

  const res = await fetch(url, {
    headers: {
      'apikey': key,
      'Authorization': 'Bearer ' + key,
    }
  });
  
  if (res.ok) {
    const data = await res.json();
    const tables = ['products', 'product_images', 'product_colors', 'product_sizes', 'product_specifications', 'product_details', 'categories', 'brands'];
    
    for (const t of tables) {
      const schema = data.definitions?.[t] || data.components?.schemas?.[t];
      if (schema) {
        console.log(`Table ${t}:`);
        console.log(`  Columns:`, Object.keys(schema.properties).join(', '));
        console.log(`  Required:`, schema.required?.join(', ') || 'none');
      } else {
        console.log(`Table ${t} not found in schema`);
      }
    }
  } else {
    console.error('Failed to fetch schema', await res.text());
  }
}

getSchema();
