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

// Ensure correct React hooks are imported
function ensureReactImports(content) {
  if (!content.includes('useEffect')) {
    if (content.includes('import { useState } from "react";')) {
      return content.replace('import { useState } from "react";', 'import { useState, useEffect } from "react";');
    } else if (content.includes('import { useState, FormEvent } from "react";')) {
      return content.replace('import { useState, FormEvent } from "react";', 'import { useState, useEffect, FormEvent } from "react";');
    } else if (content.includes('import { useEffect, useMemo, useState } from "react";')) {
      // already there
    } else {
      return 'import { useEffect, useState } from "react";\n' + content;
    }
  }
  return content;
}

// 3. HomePage.tsx
updateFile('pages/HomePage.tsx', (c) => {
  let u = ensureReactImports(c);
  u = u.replace('import { PRODUCTS } from "../data/products";', 'import { fetchProducts } from "../data/products";');
  
  if (!u.includes('const [products, setProducts]')) {
    u = u.replace('  const handleScrollToSection', 
`  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  const handleScrollToSection`);
  }
  
  u = u.replaceAll('PRODUCTS.filter', 'products.filter');
  return u;
});

// 4. ProductsPage.tsx
updateFile('pages/ProductsPage.tsx', (c) => {
  let u = ensureReactImports(c);
  u = u.replace('import { CATEGORIES, PRODUCTS, getCategoryName } from "../data/products";', 'import { fetchCategories, fetchProducts, getCategoryName } from "../data/products";');
  
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
  
  u = u.replaceAll('PRODUCTS.reduce', 'products.reduce');
  u = u.replaceAll('PRODUCTS.map', 'products.map');
  u = u.replaceAll('CATEGORIES.map', 'categories.map');
  u = u.replaceAll('let result = PRODUCTS;', 'let result = products;');
  return u;
});

// 5. ElectronicsPage.tsx
updateFile('pages/ElectronicsPage.tsx', (c) => {
  let u = ensureReactImports(c);
  u = u.replace('import { CATEGORIES, PRODUCTS } from "../data/products";', 'import { fetchCategories, fetchProducts } from "../data/products";');
  
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
  
  u = u.replaceAll('PRODUCTS.reduce', 'products.reduce');
  u = u.replaceAll('PRODUCTS.filter', 'products.filter');
  u = u.replaceAll('CATEGORIES.find', 'categories.find');
  u = u.replaceAll('CATEGORIES?', 'categories?');
  return u;
});

// 6. ProductDetailsPage.tsx
updateFile('pages/ProductDetailsPage.tsx', (c) => {
  let u = ensureReactImports(c);
  u = u.replace('import { PRODUCTS, getCategoryName, getProductsByIds, getRelatedProducts } from "../data/products";', 'import { fetchProducts, getCategoryName, getProductsByIds, getRelatedProducts } from "../data/products";');
  
  if (!u.includes('const [products, setProducts]')) {
    u = u.replace('  const { handleAddToCart, handleToggleWishlist, wishlist } = useShop();', 
`  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  const { handleAddToCart, handleToggleWishlist, wishlist } = useShop();`);
  }
  
  u = u.replaceAll('PRODUCTS.find', 'products.find');
  u = u.replaceAll('getRelatedProducts(product, 4)', 'getRelatedProducts(product, 4, products)');
  u = u.replaceAll('getProductsByIds(product.frequentlyBoughtTogether)', 'getProductsByIds(product.frequentlyBoughtTogether, products)');
  return u;
});

// 7. BrandPage.tsx
updateFile('pages/BrandPage.tsx', (c) => {
  let u = ensureReactImports(c);
  u = u.replace('import { BRANDS, PRODUCTS, getCategoryName } from "../data/products";', 'import { fetchBrands, fetchProducts, getCategoryName } from "../data/products";');
  
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
  
  u = u.replaceAll('PRODUCTS.filter', 'products.filter');
  return u;
});

// 8. BundleBuilderPage.tsx
updateFile('pages/BundleBuilderPage.tsx', (c) => {
  let u = ensureReactImports(c);
  u = u.replace('import { PRODUCTS, CATEGORIES } from "../data/products";', 'import { fetchProducts, fetchCategories } from "../data/products";');
  
  if (!u.includes('const [products, setProducts]')) {
    u = u.replace('  const [bundles, setBundles] = useState<Bundle[]>(() => {', 
`  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
    fetchCategories().then(setCategories);
  }, []);

  const [bundles, setBundles] = useState<Bundle[]>(() => {`);
  }
  
  u = u.replaceAll('PRODUCTS.reduce', 'products.reduce');
  u = u.replaceAll('PRODUCTS.filter', 'products.filter');
  u = u.replaceAll('CATEGORIES.filter', 'categories.filter');
  return u;
});

// 9. ProductGrid.tsx
updateFile('components/ProductGrid.tsx', (c) => {
  let u = ensureReactImports(c);
  u = u.replace('import { CATEGORIES, PRODUCTS } from "../data/products";', 'import { fetchCategories, fetchProducts } from "../data/products";');
  
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
  
  u = u.replaceAll('PRODUCTS.reduce', 'products.reduce');
  u = u.replaceAll('PRODUCTS.filter', 'products.filter');
  u = u.replaceAll('PRODUCTS.length', 'products.length');
  u = u.replaceAll('CATEGORIES.filter', 'categories.filter');
  u = u.replaceAll('let result = PRODUCTS;', 'let result = products;');
  return u;
});

// 10. FeaturedCategories.tsx
updateFile('components/FeaturedCategories.tsx', (c) => {
  let u = ensureReactImports(c);
  u = u.replace('import { CATEGORIES } from "../data/products";', 'import { fetchCategories } from "../data/products";');
  
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
  u = u.replace('import { BRANDS, CATEGORIES, PRODUCTS } from "../data/products";', 'import { fetchBrands, fetchCategories, fetchProducts } from "../data/products";');
  
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
  
  u = u.replaceAll('CATEGORIES.filter', 'categories.filter');
  u = u.replaceAll('BRANDS.filter', 'brands.filter');
  u = u.replaceAll('PRODUCTS.filter', 'products.filter');
  return u;
});

// 12. AdminDashboardPage.tsx
updateFile('pages/admin/AdminDashboardPage.tsx', (c) => {
  let u = ensureReactImports(c);
  u = u.replace('import { ORDERS, CUSTOMERS } from "../../data/adminData";\nimport { PRODUCTS } from "../../data/products";', 'import { fetchOrders, fetchCustomers } from "../../data/adminData";\nimport { fetchProducts } from "../../data/products";');
  
  if (!u.includes('const [orders, setOrders]')) {
    u = u.replace('  const totalRevenue = ORDERS.reduce', 
`  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchOrders().then(setOrders);
    fetchCustomers().then(setCustomers);
    fetchProducts().then(setProducts);
  }, []);

  const totalRevenue = orders.reduce`);
  }
  
  u = u.replaceAll('ORDERS.', 'orders.');
  u = u.replaceAll('CUSTOMERS.', 'customers.');
  u = u.replaceAll('PRODUCTS.', 'products.');
  return u;
});

// 13. AdminProductsPage.tsx
updateFile('pages/admin/AdminProductsPage.tsx', (c) => {
  let u = ensureReactImports(c);
  u = u.replace('import { PRODUCTS, CATEGORIES } from "../../data/products";', 'import { fetchProducts, fetchCategories } from "../../data/products";');
  
  if (!u.includes('const [products, setProducts]')) {
    u = u.replace('  const [searchQuery, setSearchQuery] = useState("");', 
`  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
    fetchCategories().then(setCategories);
  }, []);

  const [searchQuery, setSearchQuery] = useState("");`);
  }
  
  u = u.replaceAll('PRODUCTS.', 'products.');
  u = u.replaceAll('CATEGORIES.', 'categories.');
  return u;
});

// 14. AdminOrdersPage.tsx
updateFile('pages/admin/AdminOrdersPage.tsx', (c) => {
  let u = ensureReactImports(c);
  u = u.replace('import { ORDERS } from "../../data/adminData";', 'import { fetchOrders } from "../../data/adminData";');
  
  if (!u.includes('const [orders, setOrders]')) {
    u = u.replace('  const [searchQuery, setSearchQuery] = useState("");', 
`  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchOrders().then(setOrders);
  }, []);

  const [searchQuery, setSearchQuery] = useState("");`);
  }
  
  u = u.replaceAll('ORDERS.', 'orders.');
  return u;
});

// 15. AdminCustomersPage.tsx
updateFile('pages/admin/AdminCustomersPage.tsx', (c) => {
  let u = ensureReactImports(c);
  u = u.replace('import { CUSTOMERS } from "../../data/adminData";', 'import { fetchCustomers } from "../../data/adminData";');
  
  if (!u.includes('const [customers, setCustomers]')) {
    u = u.replace('  const [searchQuery, setSearchQuery] = useState("");', 
`  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    fetchCustomers().then(setCustomers);
  }, []);

  const [searchQuery, setSearchQuery] = useState("");`);
  }
  
  u = u.replaceAll('CUSTOMERS.', 'customers.');
  return u;
});

// 16. AdminReviewsPage.tsx
updateFile('pages/admin/AdminReviewsPage.tsx', (c) => {
  let u = ensureReactImports(c);
  u = u.replace('import { REVIEWS } from "../../data/adminData";', 'import { fetchReviews } from "../../data/adminData";');
  
  if (!u.includes('const [reviews, setReviews]')) {
    u = u.replace('  const [searchQuery, setSearchQuery] = useState("");', 
`  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    fetchReviews().then(setReviews);
  }, []);

  const [searchQuery, setSearchQuery] = useState("");`);
  }
  
  u = u.replaceAll('REVIEWS.', 'reviews.');
  return u;
});

// 17. Newsletter.tsx
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
