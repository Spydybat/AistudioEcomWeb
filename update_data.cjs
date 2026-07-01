const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function updateFile(filePath, updateFn) {
  const fullPath = path.join(srcDir, filePath);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    const newContent = updateFn(content);
    if (content !== newContent) {
      fs.writeFileSync(fullPath, newContent);
      console.log('Updated ' + filePath);
    }
  }
}

// 1. UPDATE data/products.ts
updateFile('data/products.ts', (content) => {
  let updated = content;
  updated = updated.replace('export const CATEGORIES:', 'export const LOCAL_CATEGORIES:');
  updated = updated.replace('export const BRANDS:', 'export const LOCAL_BRANDS:');
  // We'll replace PRODUCTS later

  
  updated = updated.replace(
    'export const getProductsByIds = (ids: string[] = []) =>\n  ids.map((id) => PRODUCTS.find((product) => product.id === id)).filter(Boolean) as Product[];',
    'export const getProductsByIds = (ids: string[] = [], productList: Product[] = LOCAL_PRODUCTS) =>\n  ids.map((id) => productList.find((product) => product.id === id)).filter(Boolean) as Product[];'
  );
  
  updated = updated.replace(
    'export const getRelatedProducts = (product: Product, limit = 4) => {\n  const explicit = getProductsByIds(product.relatedProductIds).filter((item) => item.id !== product.id);\n  const inferred = PRODUCTS.filter(',
    'export const getRelatedProducts = (product: Product, limit = 4, productList: Product[] = LOCAL_PRODUCTS) => {\n  const explicit = getProductsByIds(product.relatedProductIds, productList).filter((item) => item.id !== product.id);\n  const inferred = productList.filter('
  );
  
  updated = updated.replace('export const PRODUCTS:', 'export const LOCAL_PRODUCTS:');
  const fetchLogic = `
import { supabase } from "../supabaseClient";

export const CATEGORIES = LOCAL_CATEGORIES;
export const BRANDS = LOCAL_BRANDS;
export const PRODUCTS = LOCAL_PRODUCTS;

let cachedProducts: Product[] | null = null;
let cachedCategories: Category[] | null = null;
let cachedBrands: Brand[] | null = null;

export async function fetchProducts(): Promise<Product[]> {
  if (cachedProducts) return cachedProducts;
  try {
    const { data, error } = await supabase.from('products').select(\`
      *,
      images:product_images(url),
      colors:product_colors(name, hex),
      sizes:product_sizes(size),
      specifications:product_specifications(key, value),
      details:product_details(detail),
      variants:product_variants(*),
      reviews_data:reviews(id, author, rating, title, comment, date, verified)
    \`);
    if (error || !data || data.length === 0) return LOCAL_PRODUCTS;
    
    const formattedData = data.map((item: any) => ({
      ...item,
      images: item.images?.length ? item.images.map((img: any) => img.url) : item.images,
      colors: item.colors || [],
      sizes: item.sizes?.length ? item.sizes.map((s: any) => s.size) : item.sizes,
      specifications: item.specifications?.reduce((acc: any, spec: any) => ({ ...acc, [spec.key]: spec.value }), {}) || {},
      details: item.details?.length ? item.details.map((d: any) => d.detail) : item.details,
      variants: item.variants || [],
      reviewList: item.reviews_data || []
    }));
    cachedProducts = formattedData;
    return formattedData;
  } catch {
    return LOCAL_PRODUCTS;
  }
}

export async function fetchCategories(): Promise<Category[]> {
  if (cachedCategories) return cachedCategories;
  try {
    const { data, error } = await supabase.from('categories').select('*');
    if (error || !data || data.length === 0) return LOCAL_CATEGORIES;
    cachedCategories = data;
    return data;
  } catch {
    return LOCAL_CATEGORIES;
  }
}

export async function fetchBrands(): Promise<Brand[]> {
  if (cachedBrands) return cachedBrands;
  try {
    const { data, error } = await supabase.from('brands').select('*');
    if (error || !data || data.length === 0) return LOCAL_BRANDS;
    cachedBrands = data;
    return data;
  } catch {
    return LOCAL_BRANDS;
  }
}
`;

  return updated + fetchLogic;
});

// 2. UPDATE data/adminData.ts
updateFile('data/adminData.ts', (content) => {
  let updated = content.replace('export const ORDERS:', 'export const LOCAL_ORDERS:');
  updated = updated.replace('export const CUSTOMERS:', 'export const LOCAL_CUSTOMERS:');
  updated = updated.replace('export const REVIEWS:', 'export const LOCAL_REVIEWS:');
  
  updated = updated.replace('export const PRODUCTS:', 'export const LOCAL_PRODUCTS:');
  const fetchLogic = `
import { supabase } from "../supabaseClient";

export const ORDERS = LOCAL_ORDERS;
export const CUSTOMERS = LOCAL_CUSTOMERS;
export const REVIEWS = LOCAL_REVIEWS;

let cachedOrders: Order[] | null = null;
let cachedCustomers: Customer[] | null = null;
let cachedReviews: Review[] | null = null;

export async function fetchOrders(): Promise<Order[]> {
  if (cachedOrders) return cachedOrders;
  try {
    const { data, error } = await supabase.from('orders').select('*');
    if (error || !data || data.length === 0) return LOCAL_ORDERS;
    cachedOrders = data;
    return data;
  } catch {
    return LOCAL_ORDERS;
  }
}

export async function fetchCustomers(): Promise<Customer[]> {
  if (cachedCustomers) return cachedCustomers;
  try {
    const { data, error } = await supabase.from('profiles').select('*');
    if (error || !data || data.length === 0) return LOCAL_CUSTOMERS;
    cachedCustomers = data;
    return data;
  } catch {
    return LOCAL_CUSTOMERS;
  }
}

export async function fetchReviews(): Promise<Review[]> {
  if (cachedReviews) return cachedReviews;
  try {
    const { data, error } = await supabase.from('reviews').select('*');
    if (error || !data || data.length === 0) return LOCAL_REVIEWS;
    cachedReviews = data;
    return data;
  } catch {
    return LOCAL_REVIEWS;
  }
}
`;
  return updated + fetchLogic;
});

