import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import crypto from 'crypto';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
const getUUID = () => crypto.randomUUID();

async function checkCarts() {
  const dummy = {};
  for(let i=0; i<30; i++) {
     const {error} = await supabase.from('carts').insert([dummy]);
     if(error) {
       console.log("Error:", error.message);
       const matchNull = error.message.match(/null value in column "([^"]+)"/);
       if (matchNull) {
          dummy[matchNull[1]] = getUUID();
          console.log(`Adding ${matchNull[1]}`);
          continue;
       }
       if (error.code === '23502') { // not null violation
         const col = error.message.match(/column "([^"]+)"/);
         if(col) {
           dummy[col[1]] = getUUID();
           console.log(`Adding ${col[1]}`);
           continue;
         }
       }
       
       console.log("Other error:", error);
       break;
     } else {
       console.log("Success with", Object.keys(dummy));
       break;
     }
  }
}
checkCarts();
