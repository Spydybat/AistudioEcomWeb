import fs from 'fs';
import path from 'path';

const files = [
  'src/components/cart/CartItemRow.tsx',
  'src/components/wishlist/WishlistItemRow.tsx',
  'src/components/CartDrawer.tsx',
  'src/components/MarketplaceShowcase.tsx',
  'src/components/ProductCard.tsx',
  'src/components/ProductQuickView.tsx',
  'src/components/WishlistDrawer.tsx',
  'src/pages/admin/AdminDashboardPage.tsx',
  'src/pages/admin/AdminProductsPage.tsx',
  'src/pages/BundleBuilderPage.tsx',
  'src/pages/ProductDetailsPage.tsx'
];

for (const f of files) {
  let content = fs.readFileSync(f, 'utf-8');

  // Fix sizes
  content = content.replace(/product\.sizes\[1\]\s*\|\|\s*product\.sizes\[0\]/g, 'product?.sizes?.[1] ?? product?.sizes?.[0] ?? "Default"');
  content = content.replace(/product\?\.sizes\[1\]\s*\|\|\s*product\?\.sizes\[0\]/g, 'product?.sizes?.[1] ?? product?.sizes?.[0] ?? "Default"');
  content = content.replace(/product\.sizes\[0\]/g, 'product?.sizes?.[0] ?? "Default"');
  content = content.replace(/item\.sizes\[0\]/g, 'item?.sizes?.[0] ?? "Default"');

  // Fix colors
  content = content.replace(/product\.colors\[0\]/g, 'product?.colors?.[0] ?? { name: "Default", hex: "#000" }');
  content = content.replace(/product\?\.colors\[0\]/g, 'product?.colors?.[0] ?? { name: "Default", hex: "#000" }');
  content = content.replace(/item\.colors\[0\]/g, 'item?.colors?.[0] ?? { name: "Default", hex: "#000" }');

  // Fix images
  content = content.replace(/item\.product\.images\[0\]/g, 'item?.product?.images?.[0] ?? ""');
  content = content.replace(/product\.images\[0\]/g, 'product?.images?.[0] ?? ""');
  content = content.replace(/item\.images\[0\]/g, 'item?.images?.[0] ?? ""');
  content = content.replace(/product\.images\[1\]/g, 'product?.images?.[1]');
  content = content.replace(/product\.images\[activeImageIdx\]/g, 'product?.images?.[activeImageIdx] ?? product?.images?.[0] ?? ""');

  fs.writeFileSync(f, content);
}

console.log("Done");
