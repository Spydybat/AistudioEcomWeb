import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testInsert() {
  const dummyProduct = {
    id: "test-product-123",
    name: "Test Product",
    price: 99.99,
    originalPrice: 120,
    category: "fashion",
    brand: "Test Brand",
    rating: 4.5,
    reviews: 10,
    images: ["image1.jpg"],
    colors: [{name: "Black", hex: "#000000"}],
    sizes: ["S", "M", "L"],
    description: "A test product",
    details: ["Detail 1"]
  };

  const { data, error } = await supabase.from('products').insert([dummyProduct]).select();
  if (error) {
    console.error("Insert error:", error);
  } else {
    console.log("Successfully inserted:", data);
  }
}

testInsert();
