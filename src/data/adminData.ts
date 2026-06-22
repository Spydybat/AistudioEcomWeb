import { Order, Customer, Review } from "../types";

export const ORDERS: Order[] = [
  { id: "ORD-1001", customerName: "Elena Rossi", customerEmail: "elena.r@email.com", items: 2, total: 815, status: "delivered", date: "2026-06-18" },
  { id: "ORD-1002", customerName: "James Chen", customerEmail: "jchen@email.com", items: 1, total: 260, status: "shipped", date: "2026-06-19" },
  { id: "ORD-1003", customerName: "Sophie Laurent", customerEmail: "sophie.l@email.com", items: 3, total: 1245, status: "processing", date: "2026-06-20" },
  { id: "ORD-1004", customerName: "Marcus Webb", customerEmail: "mwebb@email.com", items: 1, total: 320, status: "pending", date: "2026-06-21" },
  { id: "ORD-1005", customerName: "Aisha Patel", customerEmail: "aisha.p@email.com", items: 2, total: 550, status: "delivered", date: "2026-06-15" },
  { id: "ORD-1006", customerName: "Tom Harrison", customerEmail: "tom.h@email.com", items: 1, total: 110, status: "cancelled", date: "2026-06-14" },
  { id: "ORD-1007", customerName: "Yuki Tanaka", customerEmail: "yuki.t@email.com", items: 4, total: 1890, status: "shipped", date: "2026-06-22" },
  { id: "ORD-1008", customerName: "Claire Dubois", customerEmail: "claire.d@email.com", items: 1, total: 495, status: "processing", date: "2026-06-22" },
];

export const CUSTOMERS: Customer[] = [
  { id: "CUS-001", name: "Elena Rossi", email: "elena.r@email.com", orders: 5, totalSpent: 2340, joinedDate: "2025-03-12", status: "active" },
  { id: "CUS-002", name: "James Chen", email: "jchen@email.com", orders: 3, totalSpent: 890, joinedDate: "2025-06-08", status: "active" },
  { id: "CUS-003", name: "Sophie Laurent", email: "sophie.l@email.com", orders: 8, totalSpent: 4120, joinedDate: "2024-11-22", status: "active" },
  { id: "CUS-004", name: "Marcus Webb", email: "mwebb@email.com", orders: 2, totalSpent: 640, joinedDate: "2026-01-15", status: "active" },
  { id: "CUS-005", name: "Aisha Patel", email: "aisha.p@email.com", orders: 4, totalSpent: 1580, joinedDate: "2025-09-03", status: "active" },
  { id: "CUS-006", name: "Tom Harrison", email: "tom.h@email.com", orders: 1, totalSpent: 110, joinedDate: "2026-06-14", status: "inactive" },
  { id: "CUS-007", name: "Yuki Tanaka", email: "yuki.t@email.com", orders: 6, totalSpent: 3200, joinedDate: "2025-02-28", status: "active" },
  { id: "CUS-008", name: "Claire Dubois", email: "claire.d@email.com", orders: 3, totalSpent: 1125, joinedDate: "2025-08-17", status: "active" },
];

export const REVIEWS: Review[] = [
  { id: "REV-001", productName: "Sartorial Double-Breasted Trench", customerName: "Elena Rossi", rating: 5, comment: "Absolutely stunning craftsmanship. The fabric quality is unmatched.", date: "2026-06-10", status: "published" },
  { id: "REV-002", productName: "Grade-A Mongolian Cashmere Sweater", customerName: "James Chen", rating: 5, comment: "The softest cashmere I've ever worn. Worth every penny.", date: "2026-06-12", status: "published" },
  { id: "REV-003", productName: "Deconstructed Linen-Wool Blazer", customerName: "Sophie Laurent", rating: 4, comment: "Beautiful blazer but sizing runs slightly small.", date: "2026-06-15", status: "published" },
  { id: "REV-004", productName: "Italian Aviator Shearling Flight Jacket", customerName: "Marcus Webb", rating: 5, comment: "A masterpiece. The shearling is incredibly luxurious.", date: "2026-06-18", status: "pending" },
  { id: "REV-005", productName: "Classic Oxford Tailored Shirt", customerName: "Aisha Patel", rating: 4, comment: "Great everyday shirt. Crisp and well-fitted.", date: "2026-06-19", status: "published" },
  { id: "REV-006", productName: "Handcrafted Chelsea Tuscan Boot", customerName: "Yuki Tanaka", rating: 5, comment: "These boots are incredibly well-made. Perfect fit.", date: "2026-06-20", status: "published" },
  { id: "REV-007", productName: "Sartorial Pleated Wool Trouser", customerName: "Tom Harrison", rating: 3, comment: "Good quality but delivery was delayed.", date: "2026-06-14", status: "hidden" },
  { id: "REV-008", productName: "Rib-Knit Cashmere Tapered Pant", customerName: "Claire Dubois", rating: 5, comment: "Perfect loungewear. So comfortable and elegant.", date: "2026-06-21", status: "pending" },
];

export const ADMIN_CREDENTIALS = {
  email: "admin@aura.studio",
  password: "auraadmin2024",
};
