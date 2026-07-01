import dotenv from 'dotenv';
dotenv.config();

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

async function run() {
  try {
      const openapi = await fetch(`${url}/rest/v1/`, {
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`
        }
      });
      const spec = await openapi.json();
      if(spec && spec.definitions) {
        console.log("Tables:", Object.keys(spec.definitions));
        // Print definition of cart related tables if they exist
        const target = ['carts', 'cart_items', 'wishlists', 'wishlist_items'];
        for (const t of target) {
           if(spec.definitions[t]) console.log(`\n--- ${t} ---\n`, spec.definitions[t].properties);
        }
      } else {
        console.log("No spec definitions");
      }
  } catch(e) {
      console.log("Failed", e);
  }
}
run();
