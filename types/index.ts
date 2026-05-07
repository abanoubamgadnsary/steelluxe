// ─── Product Types ──────────────────────────────────────────────────────────

export type Category = 'necklaces' | 'earrings' | 'rings' | 'bracelets';

export interface ProductSize {
  label: string;   // e.g. "6", "7", "8" for rings; "16in", "18in" for necklaces
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;            // in EGP
  comparePrice?: number;    // original price before discount
  images: string[];         // URLs
  description: string;
  shortDescription: string;
  category: Category;
  material: string;         // e.g. "316L Stainless Steel"
  sizes?: ProductSize[];
  tags: string[];
  stock: number;
  sold: number;
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  discount?: number;        // percentage 0–100
  createdAt: string;
  updatedAt: string;
}

// ─── Cart Types ──────────────────────────────────────────────────────────────

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedSize?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode?: string;
}

// ─── Order Types ─────────────────────────────────────────────────────────────

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentMethod = 'cod' | 'card' | 'instapay';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  selectedSize?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  governorate: string;
  postalCode?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userEmail: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  stripePaymentIntentId?: string;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  couponCode?: string;
  notes?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── User Types ───────────────────────────────────────────────────────────────

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phone?: string;
  savedAddresses: ShippingAddress[];
  wishlist: string[];        // product IDs
  role: 'customer' | 'admin';
  createdAt: string;
  updatedAt: string;
}

// ─── Review Types ─────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  rating: number;
  comment: string;
  createdAt: string;
  verified: boolean;
}

// ─── Coupon Types ─────────────────────────────────────────────────────────────

export type DiscountType = 'percentage' | 'fixed';

export interface Coupon {
  id: string;
  code: string;
  type: DiscountType;
  value: number;
  minOrderAmount?: number;
  maxUses?: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
}

// ─── Filter Types ─────────────────────────────────────────────────────────────

export interface ProductFilters {
  category?: Category | 'all';
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'popular' | 'rating';
  search?: string;
  inStock?: boolean;
}

// ─── Shipping Types ───────────────────────────────────────────────────────────

export interface ShippingZone {
  governorate: string;
  cost: number;
  estimatedDays: string;
}

// ─── Admin Types ──────────────────────────────────────────────────────────────

export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
  pendingOrders: number;
  revenueToday: number;
  ordersToday: number;
}
