import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function discover2() {
  let dummyProduct = {
    id: "d9744cba-7dc3-4a12-881f-82ba672ef9e3", // valid uuid
    name: "Test",
    price: 99.99,
    rating: 4.5,
    stock: 100,
    sku: "TEST-123",
    description: "test",
    metadata: { test: 123 },
    created_at: new Date().toISOString()
  };

  let maxAttempts = 50;
  for (let i = 0; i < maxAttempts; i++) {
    const { data, error } = await supabase.from('products').insert([dummyProduct]).select();
    if (error) {
      console.log(error.message);
      const match = error.message.match(/Could not find the '([^']+)' column/);
      if (match) {
        const col = match[1];
        console.log(`Removing column: ${col}`);
        delete dummyProduct[col];
      } else {
        console.error("Unknown error:", error);
        break;
      }
    } else {
      console.log("Successfully inserted! Schema must be:", Object.keys(dummyProduct));
      // cleanup
      await supabase.from('products').delete().eq('id', dummyProduct.id);
      break;
    }
  }
}

discover2();
