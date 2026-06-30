import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function discover() {
  let dummyProduct = {
    id: "test-product-123",
    name: "Test Product",
    price: 99.99,
    originalPrice: 120,
    category: "fashion",
    department: "men",
    brand: "Test Brand",
    brandSlug: "test-brand",
    rating: 4.5,
    reviews: 10,
    badge: "new",
    images: ["image1.jpg"],
    colors: [{name: "Black", hex: "#000000"}],
    sizes: ["S", "M", "L"],
    description: "A test product",
    details: ["Detail 1"],
    specifications: { "Weight": "1kg" },
    variants: [],
    reviewList: [],
    tags: ["test"],
    stock: 100,
    sku: "TEST-123",
    shipping: "Free",
    warranty: "1 year",
    isBestSeller: false,
    isTrending: false,
    isFlashDeal: false,
    dealEndsAt: new Date().toISOString(),
    relatedProductIds: [],
    frequentlyBoughtTogether: []
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

discover();
