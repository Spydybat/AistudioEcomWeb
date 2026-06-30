import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { PRODUCTS } from './src/data/products.ts';
import { parse } from 'csv-parse/sync';

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

  const idMap = {};
  for (let i = 1; i < lines.length; i++) {
    const record = parseCSVLine(lines[i]);
    if (record[skuIndex]) {
      idMap[record[skuIndex]] = record[idIndex];
    }
  }

  const sizeRows = [];

  for (const p of PRODUCTS) {
    const productId = idMap[p.sku];
    if (!productId) continue;

    if (p.sizes) {
      for (const s of p.sizes) {
        // Added id to match Supabase schema requirements (no created_at)
        sizeRows.push({ id: crypto.randomUUID(), product_id: productId, size: s });
      }
    }
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

  writeCSV(path.join(csvDir, 'product_sizes.csv'), sizeRows);
}

run();
