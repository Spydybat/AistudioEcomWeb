import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import { PRODUCTS } from './src/data/products.ts';

dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

function escapeCSV(val) {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function writeCSV(filename, rows) {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  let csv = headers.join(',') + '\n';
  for (const row of rows) {
    csv += headers.map(h => escapeCSV(row[h])).join(',') + '\n';
  }
  fs.writeFileSync(filename, csv);
  console.log(`Wrote ${filename}`);
}

async function run() {
  const { data: categories } = await supabase.from('categories').select('*');
  const { data: brands } = await supabase.from('brands').select('*');

  const categoryMap = {};
  if (categories) {
    for (const c of categories) {
      categoryMap[c.slug] = c.id;
      categoryMap[c.name] = c.id;
    }
  }

  const brandMap = {};
  if (brands) {
    for (const b of brands) {
      brandMap[b.slug] = b.id;
      brandMap[b.name] = b.id;
    }
  }

  const productRows = [];
  const imageRows = [];
  const colorRows = [];
  const sizeRows = [];
  const specRows = [];
  const detailRows = [];

  for (const p of PRODUCTS) {
    const productId = crypto.randomUUID();

    const catId = categoryMap[p.category] || categoryMap[p.category?.toLowerCase()] || p.category;
    const brandId = brandMap[p.brand] || brandMap[p.brandSlug] || p.brand;

    productRows.push({
      id: productId,
      name: p.name,
      price: p.price,
      original_price: p.originalPrice || '',
      category_id: catId,
      department: p.department || '',
      brand_id: brandId,
      rating: p.rating || '',
      reviews: p.reviews || '',
      badge: p.badge || '',
      description: p.description || '',
      stock: p.stock || '',
      sku: p.sku || '',
      shipping: p.shipping || '',
      warranty: p.warranty || '',
      is_best_seller: p.isBestSeller ? 'true' : 'false',
      is_trending: p.isTrending ? 'true' : 'false',
      is_flash_deal: p.isFlashDeal ? 'true' : 'false',
      deal_ends_at: p.dealEndsAt || ''
    });

    if (p.images) {
      for (const img of p.images) {
        imageRows.push({ product_id: productId, url: img });
      }
    }

    if (p.colors) {
      for (const c of p.colors) {
        colorRows.push({ product_id: productId, name: c.name, hex: c.hex });
      }
    }

    if (p.sizes) {
      for (const s of p.sizes) {
        sizeRows.push({ product_id: productId, size: s });
      }
    }

    if (p.specifications) {
      for (const [k, v] of Object.entries(p.specifications)) {
        specRows.push({ product_id: productId, key: k, value: v });
      }
    }

    if (p.details) {
      for (const d of p.details) {
        detailRows.push({ product_id: productId, detail: d });
      }
    }
  }

  const csvDir = path.join(process.cwd(), 'csv');
  if (!fs.existsSync(csvDir)) {
    fs.mkdirSync(csvDir);
  }

  if (categories) writeCSV(path.join(csvDir, 'categories.csv'), categories);
  if (brands) writeCSV(path.join(csvDir, 'brands.csv'), brands);
  
  writeCSV(path.join(csvDir, 'products.csv'), productRows);
  writeCSV(path.join(csvDir, 'product_images.csv'), imageRows);
  writeCSV(path.join(csvDir, 'product_colors.csv'), colorRows);
  writeCSV(path.join(csvDir, 'product_sizes.csv'), sizeRows);
  writeCSV(path.join(csvDir, 'product_specifications.csv'), specRows);
  writeCSV(path.join(csvDir, 'product_details.csv'), detailRows);
}

run().catch(console.error);
