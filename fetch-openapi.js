import dotenv from 'dotenv';
dotenv.config();

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

async function run() {
  try {
      const openapi = await fetch(`${url}/rest/v1/?apikey=${key}`, {
        headers: {
          'Authorization': `Bearer ${key}`
        }
      });
      const spec = await openapi.json();
      if(spec && spec.definitions) {
        console.log("Tables:");
        console.log(Object.keys(spec.definitions));
        for (const t of ['carts', 'cart_items', 'wishlists', 'wishlist_items', 'profiles']) {
           if(spec.definitions[t]) {
               console.log(`\n--- ${t} ---\n`, Object.keys(spec.definitions[t].properties));
           }
        }
        
        console.log("RPCs (paths):");
        const paths = Object.keys(spec.paths).filter(p => p.startsWith('/rpc/'));
        console.log(paths);
      } else {
        console.log("No spec definitions");
      }
  } catch(e) {
      console.log("Failed", e);
  }
}
run();
