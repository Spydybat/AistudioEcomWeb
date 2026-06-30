import fs from 'fs';
import path from 'path';
import { PRODUCTS } from './src/data/products.ts';

function escapeCSV(val) {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function parseCSVLine(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += c;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
      } else if (c === ',') {
        result.push(cur);
        cur = '';
      } else {
        cur += c;
      }
    }
  }
  result.push(cur);
  return result;
}

function run() {
  const csvDir = path.join(process.cwd(), 'csv');
  const productsCsvPath = path.join(csvDir, 'products.csv');
  
  const existingCsvContent = fs.readFileSync(productsCsvPath, 'utf8');
  const lines = existingCsvContent.split('\n').filter(l => l.trim() !== '');
  
  const headers = parseCSVLine(lines[0]);
  const idIndex = headers.indexOf('id');
  const skuIndex = headers.indexOf('sku');
  const catIndex = headers.indexOf('category_id');
  const brandIndex = headers.indexOf('brand_id');

  const idMap = {};
  const catMap = {};
  const brandMap = {};
  
  for (let i = 1; i < lines.length; i++) {
    const record = parseCSVLine(lines[i]);
    if (record[skuIndex]) {
      idMap[record[skuIndex]] = record[idIndex];
      catMap[record[skuIndex]] = record[catIndex];
      brandMap[record[skuIndex]] = record[brandIndex];
    }
  }

  const productRows = [];
  const now = new Date().toISOString();

  for (const p of PRODUCTS) {
    const existingId = idMap[p.sku];
    const catId = catMap[p.sku];
    const brandId = brandMap[p.sku];
    
    productRows.push({
      id: existingId || '',
      category_id: catId || '',
      brand_id: brandId || '',
      name: p.name || '',
      slug: p.id || '', // from products.ts, p.id is the slug text
      sku: p.sku || '',
      description: p.description || '',
      price: p.price || '',
      original_price: p.originalPrice || '',
      stock: p.stock || '',
      rating: p.rating || '',
      reviews_count: p.reviews || '',
      shipping: p.shipping || '',
      warranty: p.warranty || '',
      badge: p.badge || '',
      thumbnail: (p.images && p.images.length > 0) ? p.images[0] : '',
      is_best_seller: p.isBestSeller ? 'true' : 'false',
      is_trending: p.isTrending ? 'true' : 'false',
      is_flash_deal: p.isFlashDeal ? 'true' : 'false',
      is_active: 'true',
      deal_ends_at: p.dealEndsAt || '',
      created_at: now,
      updated_at: now
    });
  }

  if (productRows.length > 0) {
    const newHeaders = [
      'id', 'category_id', 'brand_id', 'name', 'slug', 'sku', 'description', 
      'price', 'original_price', 'stock', 'rating', 'reviews_count', 'shipping', 
      'warranty', 'badge', 'thumbnail', 'is_best_seller', 'is_trending', 
      'is_flash_deal', 'is_active', 'deal_ends_at', 'created_at', 'updated_at'
    ];
    let csv = newHeaders.join(',') + '\n';
    for (const row of productRows) {
      csv += newHeaders.map(h => escapeCSV(row[h])).join(',') + '\n';
    }
    const tempCsvPath = path.join(csvDir, 'products-temp.csv');
    fs.writeFileSync(tempCsvPath, csv);
    console.log(`Wrote ${tempCsvPath}`);
  }
}

run();
