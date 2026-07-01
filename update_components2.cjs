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

// 12. AdminDashboardPage.tsx
updateFile('pages/admin/AdminDashboardPage.tsx', (c) => {
  let u = ensureReactImports(c);
  u = u.replace(/import\s+{\s*ORDERS,\s*CUSTOMERS\s*}\s+from\s+['"]\.\.\/\.\.\/data\/adminData['"];?/, 'import { fetchOrders, fetchCustomers } from "../../data/adminData";');
  u = u.replace(/import\s+{\s*PRODUCTS\s*}\s+from\s+['"]\.\.\/\.\.\/data\/products['"];?/, 'import { fetchProducts } from "../../data/products";');
  
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
  
  u = u.replace(/ORDERS\./g, 'orders.');
  u = u.replace(/CUSTOMERS\./g, 'customers.');
  u = u.replace(/PRODUCTS\./g, 'products.');
  return u;
});

// 13. AdminProductsPage.tsx
updateFile('pages/admin/AdminProductsPage.tsx', (c) => {
  let u = ensureReactImports(c);
  u = u.replace(/import\s+{\s*PRODUCTS,\s*CATEGORIES\s*}\s+from\s+['"]\.\.\/\.\.\/data\/products['"];?/, 'import { fetchProducts, fetchCategories } from "../../data/products";');
  
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
  
  u = u.replace(/PRODUCTS\./g, 'products.');
  u = u.replace(/CATEGORIES\./g, 'categories.');
  return u;
});

// 14. AdminOrdersPage.tsx
updateFile('pages/admin/AdminOrdersPage.tsx', (c) => {
  let u = ensureReactImports(c);
  u = u.replace(/import\s+{\s*ORDERS\s*}\s+from\s+['"]\.\.\/\.\.\/data\/adminData['"];?/, 'import { fetchOrders } from "../../data/adminData";');
  
  if (!u.includes('const [orders, setOrders]')) {
    u = u.replace('  const [searchQuery, setSearchQuery] = useState("");', 
`  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchOrders().then(setOrders);
  }, []);

  const [searchQuery, setSearchQuery] = useState("");`);
  }
  
  u = u.replace(/ORDERS\./g, 'orders.');
  return u;
});

// 15. AdminCustomersPage.tsx
updateFile('pages/admin/AdminCustomersPage.tsx', (c) => {
  let u = ensureReactImports(c);
  u = u.replace(/import\s+{\s*CUSTOMERS\s*}\s+from\s+['"]\.\.\/\.\.\/data\/adminData['"];?/, 'import { fetchCustomers } from "../../data/adminData";');
  
  if (!u.includes('const [customers, setCustomers]')) {
    u = u.replace('  const [searchQuery, setSearchQuery] = useState("");', 
`  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    fetchCustomers().then(setCustomers);
  }, []);

  const [searchQuery, setSearchQuery] = useState("");`);
  }
  
  u = u.replace(/CUSTOMERS\./g, 'customers.');
  return u;
});

// 16. AdminReviewsPage.tsx
updateFile('pages/admin/AdminReviewsPage.tsx', (c) => {
  let u = ensureReactImports(c);
  u = u.replace(/import\s+{\s*REVIEWS\s*}\s+from\s+['"]\.\.\/\.\.\/data\/adminData['"];?/, 'import { fetchReviews } from "../../data/adminData";');
  
  if (!u.includes('const [reviews, setReviews]')) {
    u = u.replace('  const [searchQuery, setSearchQuery] = useState("");', 
`  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    fetchReviews().then(setReviews);
  }, []);

  const [searchQuery, setSearchQuery] = useState("");`);
  }
  
  u = u.replace(/REVIEWS\./g, 'reviews.');
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
