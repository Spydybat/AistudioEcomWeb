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

// Ensure proper import for useEffect and useState
function ensureReactImports(content) {
  if (!content.includes('import { useEffect')) {
    if (content.match(/import\s+{.*useState.*}\s+from\s+['"]react['"]/)) {
      return content.replace(/import\s+{(.*useState.*)}\s+from\s+['"]react['"]/, 'import { $1, useEffect } from "react"');
    } else {
      return 'import { useEffect, useState } from "react";\n' + content;
    }
  }
  return content;
}

// 3. HomePage.tsx
updateFile('pages/HomePage.tsx', (c) => {
  let u = ensureReactImports(c);
  u = u.replace(/import\s+{.*PRODUCTS.*}\s+from\s+['"]\.\.\/data\/products['"];?/, 'import { fetchProducts } from "../data/products";');
  
  if (!u.includes('const [products, setProducts]')) {
    u = u.replace('  const handleScrollToSection', 
`  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  const handleScrollToSection`);
  }
  
  u = u.replace(/PRODUCTS\.filter/g, 'products.filter');
  return u;
});

// 4. ProductsPage.tsx
updateFile('pages/ProductsPage.tsx', (c) => {
  let u = ensureReactImports(c);
  u = u.replace(/import\s+{\s*CATEGORIES,\s*PRODUCTS,\s*getCategoryName\s*}\s+from\s+['"]\.\.\/data\/products['"];?/, 'import { fetchCategories, fetchProducts, getCategoryName } from "../data/products";');
  
  if (!u.includes('const [products, setProducts]')) {
    u = u.replace('  const [isLoading, setIsLoading] = useState(false);', 
`  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
    fetchCategories().then(setCategories);
  }, []);

  const [isLoading, setIsLoading] = useState(false);`);
  }
  
  u = u.replace(/PRODUCTS\.reduce/g, 'products.reduce');
  u = u.replace(/PRODUCTS\.map/g, 'products.map');
  u = u.replace(/CATEGORIES\.map/g, 'categories.map');
  u = u.replace(/let result = PRODUCTS;/g, 'let result = products;');
  return u;
});

// 5. ElectronicsPage.tsx
updateFile('pages/ElectronicsPage.tsx', (c) => {
  let u = ensureReactImports(c);
  u = u.replace(/import\s+{\s*CATEGORIES,\s*PRODUCTS\s*}\s+from\s+['"]\.\.\/data\/products['"];?/, 'import { fetchCategories, fetchProducts } from "../data/products";');
  
  if (!u.includes('const [products, setProducts]')) {
    u = u.replace('  const [isLoading, setIsLoading] = useState(false);', 
`  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
    fetchCategories().then(setCategories);
  }, []);

  const [isLoading, setIsLoading] = useState(false);`);
  }
  
  u = u.replace(/PRODUCTS\.reduce/g, 'products.reduce');
  u = u.replace(/PRODUCTS\.filter/g, 'products.filter');
  u = u.replace(/CATEGORIES\.find/g, 'categories.find');
  u = u.replace(/CATEGORIES\?/g, 'categories?');
  return u;
});

// 6. ProductDetailsPage.tsx
updateFile('pages/ProductDetailsPage.tsx', (c) => {
  let u = ensureReactImports(c);
  u = u.replace(/import\s+{\s*PRODUCTS,\s*getCategoryName,\s*getProductsByIds,\s*getRelatedProducts\s*}\s+from\s+['"]\.\.\/data\/products['"];?/, 'import { fetchProducts, getCategoryName, getProductsByIds, getRelatedProducts } from "../data/products";');
  
  if (!u.includes('const [products, setProducts]')) {
    u = u.replace('  const { handleAddToCart, handleToggleWishlist, wishlist } = useShop();', 
`  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  const { handleAddToCart, handleToggleWishlist, wishlist } = useShop();`);
  }
  
  u = u.replace(/PRODUCTS\.find/g, 'products.find');
  u = u.replace(/getRelatedProducts\(product, 4\)/g, 'getRelatedProducts(product, 4, products)');
  u = u.replace(/getProductsByIds\(product.frequentlyBoughtTogether\)/g, 'getProductsByIds(product.frequentlyBoughtTogether, products)');
  return u;
});

// 7. BrandPage.tsx
updateFile('pages/BrandPage.tsx', (c) => {
  let u = ensureReactImports(c);
  u = u.replace(/import\s+{\s*BRANDS,\s*PRODUCTS,\s*getCategoryName\s*}\s+from\s+['"]\.\.\/data\/products['"];?/, 'import { fetchBrands, fetchProducts, getCategoryName } from "../data/products";');
  
  if (!u.includes('const [products, setProducts]')) {
    u = u.replace('  const brand = BRANDS.find', 
`  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
    fetchBrands().then(setBrands);
  }, []);

  const brand = brands.find`);
  }
  
  u = u.replace(/PRODUCTS\.filter/g, 'products.filter');
  return u;
});

// 8. BundleBuilderPage.tsx
updateFile('pages/BundleBuilderPage.tsx', (c) => {
  let u = ensureReactImports(c);
  u = u.replace(/import\s+{\s*PRODUCTS,\s*CATEGORIES\s*}\s+from\s+['"]\.\.\/data\/products['"];?/, 'import { fetchProducts, fetchCategories } from "../data/products";');
  
  if (!u.includes('const [products, setProducts]')) {
    u = u.replace('  const [bundles, setBundles] = useState<Bundle\\[\\]>\\(\\(\\) => {', 
`  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
    fetchCategories().then(setCategories);
  }, []);

  const [bundles, setBundles] = useState<Bundle[]>(() => {`);
  }
  
  u = u.replace(/PRODUCTS\.reduce/g, 'products.reduce');
  u = u.replace(/PRODUCTS\.filter/g, 'products.filter');
  u = u.replace(/CATEGORIES\.filter/g, 'categories.filter');
  return u;
});

// 9. ProductGrid.tsx
updateFile('components/ProductGrid.tsx', (c) => {
  let u = ensureReactImports(c);
  u = u.replace(/import\s+{\s*CATEGORIES,\s*PRODUCTS\s*}\s+from\s+['"]\.\.\/data\/products['"];?/, 'import { fetchCategories, fetchProducts } from "../data/products";');
  
  if (!u.includes('const [products, setProducts]')) {
    u = u.replace('  const [isLoading, setIsLoading] = useState(false);', 
`  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
    fetchCategories().then(setCategories);
  }, []);

  const [isLoading, setIsLoading] = useState(false);`);
  }
  
  u = u.replace(/PRODUCTS\.reduce/g, 'products.reduce');
  u = u.replace(/PRODUCTS\.filter/g, 'products.filter');
  u = u.replace(/PRODUCTS\.length/g, 'products.length');
  u = u.replace(/CATEGORIES\.filter/g, 'categories.filter');
  u = u.replace(/let result = PRODUCTS;/g, 'let result = products;');
  return u;
});

// 10. FeaturedCategories.tsx
updateFile('components/FeaturedCategories.tsx', (c) => {
  let u = ensureReactImports(c);
  u = u.replace(/import\s+{\s*CATEGORIES\s*}\s+from\s+['"]\.\.\/data\/products['"];?/, 'import { fetchCategories } from "../data/products";');
  
  if (!u.includes('const [categories, setCategories]')) {
    u = u.replace('  const featured = CATEGORIES.filter', 
`  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  const featured = categories.filter`);
  }
  return u;
});

// 11. MarketplaceShowcase.tsx
updateFile('components/MarketplaceShowcase.tsx', (c) => {
  let u = ensureReactImports(c);
  u = u.replace(/import\s+{\s*BRANDS,\s*CATEGORIES,\s*PRODUCTS\s*}\s+from\s+['"]\.\.\/data\/products['"];?/, 'import { fetchBrands, fetchCategories, fetchProducts } from "../data/products";');
  
  if (!u.includes('const [products, setProducts]')) {
    u = u.replace('  const [activeCategory, setActiveCategory] = useState("all");', 
`  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
    fetchCategories().then(setCategories);
    fetchBrands().then(setBrands);
  }, []);

  const [activeCategory, setActiveCategory] = useState("all");`);
  }
  
  u = u.replace(/CATEGORIES\.filter/g, 'categories.filter');
  u = u.replace(/BRANDS\.filter/g, 'brands.filter');
  u = u.replace(/PRODUCTS\.filter/g, 'products.filter');
  return u;
});
