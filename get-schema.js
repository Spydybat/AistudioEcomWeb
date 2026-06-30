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
    const productsSchema = data.definitions?.products || data.components?.schemas?.products;
    console.log(JSON.stringify(productsSchema, null, 2));
  } else {
    console.error(await res.text());
  }
}

getSchema();
