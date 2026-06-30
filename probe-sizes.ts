import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function probeTable(table) {
  let dummy = {
    id: "00000000-0000-0000-0000-000000000000"
  };

  for (let i = 0; i < 50; i++) {
    const { data, error } = await supabase.from(table).insert([dummy]).select();
    if (error) {
      const matchCol = error.message.match(/Could not find the '([^']+)' column/);
      if (matchCol) {
        delete dummy[matchCol[1]];
      } else {
        const matchNotNull = error.message.match(/null value in column "([^"]+)"/);
        if (matchNotNull) {
          console.log(`Table ${table} required column: ${matchNotNull[1]}`);
          // Assign a dummy value based on likely type
          if (matchNotNull[1] === 'product_id') {
              dummy[matchNotNull[1]] = "00000000-0000-0000-0000-000000000000";
          } else {
              dummy[matchNotNull[1]] = "test";
          }
        } else if (error.message.includes('foreign key constraint') || error.message.includes('invalid input syntax for type uuid')) {
          console.log(`Table ${table} hit constraint, schema must be:`, Object.keys(dummy));
          return Object.keys(dummy);
        } else {
          console.error(`Table ${table} error:`, error);
          return Object.keys(dummy);
        }
      }
    } else {
      console.log(`Table ${table} schema:`, Object.keys(dummy));
      await supabase.from(table).delete().eq('id', dummy.id);
      return Object.keys(dummy);
    }
  }
}

async function run() {
  await probeTable('product_sizes');
}
run();
