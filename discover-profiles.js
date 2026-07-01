import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import crypto from 'crypto';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

function getUUID() {
    return crypto.randomUUID();
}

async function discoverTable(tableName, dummyRow) {
  let currentDummy = { ...dummyRow };
  let maxAttempts = 20;
  for (let i = 0; i < maxAttempts; i++) {
    const { data, error } = await supabase.from(tableName).insert([currentDummy]).select();
    if (error) {
      const match = error.message.match(/Could not find the '([^']+)' column/);
      if (match) {
        const col = match[1];
        delete currentDummy[col];
      } else if (error.message.includes('violates foreign key constraint')) {
        console.log(`Foreign key error for ${tableName}:`, error.message);
        break; // Stop if it's a foreign key error, we've found valid columns
      } else if (error.message.includes('violates not-null constraint')) {
        const nullMatch = error.message.match(/column "([^"]+)"/);
        console.log(`Missing NOT NULL column in ${tableName}:`, nullMatch ? nullMatch[1] : error.message);
        currentDummy[nullMatch[1]] = getUUID(); // Just provide a UUID for missing NOT NULL
      } else {
        console.error(`Unknown error for ${tableName}:`, error);
        break;
      }
    } else {
      console.log(`Schema for ${tableName}:`, Object.keys(currentDummy));
      await supabase.from(tableName).delete().eq('id', currentDummy.id);
      break;
    }
  }
}

async function discover() {
  await discoverTable('profiles', {
    id: getUUID(),
    email: "test@example.com",
    role: "user",
    created_at: new Date().toISOString()
  });
}

discover();
