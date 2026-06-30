import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function findTable() {
  const possibleNames = ['product_sizes', 'sizes', 'product_size', 'product_variants', 'variants'];
  for (const name of possibleNames) {
    const { data, error } = await supabase.from(name).select('*').limit(1);
    if (!error) {
      console.log(`Found table: ${name}`);
      // Let's probe its required columns
      let dummy = { id: "00000000-0000-0000-0000-000000000000" };
      for (let i = 0; i < 20; i++) {
        const { error: insErr } = await supabase.from(name).insert([dummy]).select();
        if (insErr) {
          const matchCol = insErr.message.match(/Could not find the '([^']+)' column/);
          if (matchCol) {
            delete dummy[matchCol[1]];
          } else {
            const matchNotNull = insErr.message.match(/null value in column "([^"]+)"/);
            if (matchNotNull) {
              dummy[matchNotNull[1]] = "test";
              console.log(`Table ${name} missing column: ${matchNotNull[1]}`);
            } else if (insErr.message.includes('foreign key constraint')) {
              console.log(`Table ${name} hit FK, columns must be:`, Object.keys(dummy));
              break;
            } else {
              console.log(`Table ${name} other error:`, insErr);
              break;
            }
          }
        } else {
          console.log(`Table ${name} inserted successfully. Columns:`, Object.keys(dummy));
          await supabase.from(name).delete().eq('id', dummy.id);
          break;
        }
      }
    } else {
      console.log(`Table ${name} error: ${error.message}`);
    }
  }
}
findTable();
