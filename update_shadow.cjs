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

function addReactImports(content) {
  if (!content.includes('useEffect')) {
    if (content.match(/import\s+{.*useState.*}\s+from\s+['"]react['"]/)) {
      return content.replace(/import\s+{(.*useState.*)}\s+from\s+['"]react['"]/, 'import { $1, useEffect } from "react"');
    } else {
      return 'import { useEffect, useState } from "react";\n' + content;
    }
  }
  return content;
}

// Map the imports correctly
function replaceImports(content) {
  let u = content;
  u = u.replace(/import\s+{\s*([^}]*)\s*}\s+from\s+['"](\.\.\/data\/products|\.\.\/\.\.\/data\/products)['"];?/, (match, p1, p2) => {
    const imports = p1.split(',').map(s => s.trim());
    const newImports = imports.map(imp => {
      if (['PRODUCTS', 'CATEGORIES', 'BRANDS'].includes(imp)) return `fetch${imp.charAt(0) + imp.slice(1).toLowerCase()}`;
      return imp;
    });
    return `import { ${newImports.join(', ')} } from "${p2}";`;
  });
  
  u = u.replace(/import\s+{\s*([^}]*)\s*}\s+from\s+['"](\.\.\/data\/adminData|\.\.\/\.\.\/data\/adminData)['"];?/, (match, p1, p2) => {
    const imports = p1.split(',').map(s => s.trim());
    const newImports = imports.map(imp => {
      if (['ORDERS', 'CUSTOMERS', 'REVIEWS'].includes(imp)) return `fetch${imp.charAt(0) + imp.slice(1).toLowerCase()}`;
      return imp;
    });
    return `import { ${newImports.join(', ')} } from "${p2}";`;
  });
  return u;
}

function injectState(content, statesStr) {
  // Find the first line inside the component body.
  // We'll look for `export default function ComponentName(...) {`
  const regex = /(export\s+default\s+function\s+[A-Za-z0-9_]+\s*\([\s\S]*?\)\s*\{)/;
  if (content.match(regex)) {
    return content.replace(regex, `$1\n${statesStr}`);
  }
  return content;
}

const statesMap = {
  'pages/HomePage.tsx': `  const [PRODUCTS, setPRODUCTS] = useState<any[]>([]);\n  useEffect(() => { fetchProducts().then(setPRODUCTS); }, []);`,
  'pages/ProductsPage.tsx': `  const [PRODUCTS, setPRODUCTS] = useState<any[]>([]);\n  const [CATEGORIES, setCATEGORIES] = useState<any[]>([]);\n  useEffect(() => { fetchProducts().then(setPRODUCTS); fetchCategories().then(setCATEGORIES); }, []);`,
  'pages/ElectronicsPage.tsx': `  const [PRODUCTS, setPRODUCTS] = useState<any[]>([]);\n  const [CATEGORIES, setCATEGORIES] = useState<any[]>([]);\n  useEffect(() => { fetchProducts().then(setPRODUCTS); fetchCategories().then(setCATEGORIES); }, []);`,
  'pages/ProductDetailsPage.tsx': `  const [PRODUCTS, setPRODUCTS] = useState<any[]>([]);\n  useEffect(() => { fetchProducts().then(setPRODUCTS); }, []);`,
  'pages/BrandPage.tsx': `  const [PRODUCTS, setPRODUCTS] = useState<any[]>([]);\n  const [BRANDS, setBRANDS] = useState<any[]>([]);\n  useEffect(() => { fetchProducts().then(setPRODUCTS); fetchBrands().then(setBRANDS); }, []);`,
  'pages/BundleBuilderPage.tsx': `  const [PRODUCTS, setPRODUCTS] = useState<any[]>([]);\n  const [CATEGORIES, setCATEGORIES] = useState<any[]>([]);\n  useEffect(() => { fetchProducts().then(setPRODUCTS); fetchCategories().then(setCATEGORIES); }, []);`,
  'components/ProductGrid.tsx': `  const [PRODUCTS, setPRODUCTS] = useState<any[]>([]);\n  const [CATEGORIES, setCATEGORIES] = useState<any[]>([]);\n  useEffect(() => { fetchProducts().then(setPRODUCTS); fetchCategories().then(setCATEGORIES); }, []);`,
  'components/FeaturedCategories.tsx': `  const [CATEGORIES, setCATEGORIES] = useState<any[]>([]);\n  useEffect(() => { fetchCategories().then(setCATEGORIES); }, []);`,
  'components/MarketplaceShowcase.tsx': `  const [PRODUCTS, setPRODUCTS] = useState<any[]>([]);\n  const [CATEGORIES, setCATEGORIES] = useState<any[]>([]);\n  const [BRANDS, setBRANDS] = useState<any[]>([]);\n  useEffect(() => { fetchProducts().then(setPRODUCTS); fetchCategories().then(setCATEGORIES); fetchBrands().then(setBRANDS); }, []);`,
  'pages/admin/AdminDashboardPage.tsx': `  const [PRODUCTS, setPRODUCTS] = useState<any[]>([]);\n  const [ORDERS, setORDERS] = useState<any[]>([]);\n  const [CUSTOMERS, setCUSTOMERS] = useState<any[]>([]);\n  useEffect(() => { fetchProducts().then(setPRODUCTS); fetchOrders().then(setORDERS); fetchCustomers().then(setCUSTOMERS); }, []);`,
  'pages/admin/AdminProductsPage.tsx': `  const [PRODUCTS, setPRODUCTS] = useState<any[]>([]);\n  const [CATEGORIES, setCATEGORIES] = useState<any[]>([]);\n  useEffect(() => { fetchProducts().then(setPRODUCTS); fetchCategories().then(setCATEGORIES); }, []);`,
  'pages/admin/AdminOrdersPage.tsx': `  const [ORDERS, setORDERS] = useState<any[]>([]);\n  useEffect(() => { fetchOrders().then(setORDERS); }, []);`,
  'pages/admin/AdminCustomersPage.tsx': `  const [CUSTOMERS, setCUSTOMERS] = useState<any[]>([]);\n  useEffect(() => { fetchCustomers().then(setCUSTOMERS); }, []);`,
  'pages/admin/AdminReviewsPage.tsx': `  const [REVIEWS, setREVIEWS] = useState<any[]>([]);\n  useEffect(() => { fetchReviews().then(setREVIEWS); }, []);`,
};

Object.keys(statesMap).forEach(file => {
  updateFile(file, (c) => {
    let u = addReactImports(c);
    u = replaceImports(u);
    u = injectState(u, statesMap[file]);
    
    // In ProductDetailsPage, getRelatedProducts needs the PRODUCTS array passed in
    if (file === 'pages/ProductDetailsPage.tsx') {
      u = u.replace('getRelatedProducts(product, 4)', 'getRelatedProducts(product, 4, PRODUCTS)');
      u = u.replace('getProductsByIds(product.frequentlyBoughtTogether)', 'getProductsByIds(product.frequentlyBoughtTogether, PRODUCTS)');
    }
    
    return u;
  });
});

// Newsletter
updateFile('components/Newsletter.tsx', (c) => {
  let u = c;
  if (!u.includes('import { supabase } from "../supabaseClient";')) {
    u = u.replace('import { motion } from "motion/react";', 'import { motion } from "motion/react";\nimport { supabase } from "../supabaseClient";');
  }
  
  if (!u.includes('supabase.from(')) {
    u = u.replace('  const handleSubscribe = (e: FormEvent) => {\n    e.preventDefault();\n    if (email.trim() && email.includes("@")) {\n      setIsSuccess(true);\n      setEmail("");\n    }\n  };', 
`  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes("@")) {
      await supabase.from('newsletter_subscribers').insert([{ email }]);
      setIsSuccess(true);
      setEmail("");
    }
  };`);
  }
  return u;
});

