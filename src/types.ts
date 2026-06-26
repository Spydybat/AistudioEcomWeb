export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductVariant {
  id: string;
  label: string;
  value: string;
  priceAdjustment?: number;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified?: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  department?: string;
  brand?: string;
  brandSlug?: string;
  rating: number;
  reviews: number;
  badge?: string;
  images: string[]; // first image is primary, second is hover/detail view
  colors: ProductColor[];
  sizes: string[];
  description: string;
  details: string[];
  specifications?: Record<string, string>;
  variants?: ProductVariant[];
  reviewList?: ProductReview[];
  tags?: string[];
  stock?: number;
  sku?: string;
  shipping?: string;
  warranty?: string;
  isBestSeller?: boolean;
  isTrending?: boolean;
  isFlashDeal?: boolean;
  dealEndsAt?: string;
  relatedProductIds?: string[];
  frequentlyBoughtTogether?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: ProductColor;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  featured?: boolean;
  subcategories?: string[];
  brands?: string[];
}

export interface Brand {
  id: string;
  name: string;
  tagline: string;
  categoryIds: string[];
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
  joinedDate: string;
  status: "active" | "inactive";
}

export interface Review {
  id: string;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  status: "published" | "pending" | "hidden";
}
