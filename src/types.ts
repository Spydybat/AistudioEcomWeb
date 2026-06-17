export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  rating: number;
  reviews: number;
  badge?: string;
  images: string[]; // first image is primary, second is hover/detail view
  colors: ProductColor[];
  sizes: string[];
  description: string;
  details: string[];
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
}
