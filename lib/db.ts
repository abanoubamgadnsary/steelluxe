import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, startAfter, DocumentSnapshot,
  serverTimestamp, increment, arrayUnion, arrayRemove, setDoc,
  QueryConstraint,
} from 'firebase/firestore';
import {
  ref, uploadBytesResumable, getDownloadURL, deleteObject,
} from 'firebase/storage';
import { db, storage } from './firebase';
import type { Product, Order, UserProfile, Review, Coupon, ProductFilters, AdminStats } from '@/types';

// ─── Collections ──────────────────────────────────────────────────────────────
const PRODUCTS = 'products';
const ORDERS = 'orders';
const USERS = 'users';
const REVIEWS = 'reviews';
const COUPONS = 'coupons';

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getProducts(filters: ProductFilters = {}, pageSize = 12, lastDoc?: DocumentSnapshot) {
  const constraints: QueryConstraint[] = [];
  if (filters.category && filters.category !== 'all') {
    constraints.push(where('category', '==', filters.category));
  }
  if (filters.inStock) constraints.push(where('stock', '>', 0));
  if (filters.minPrice !== undefined) constraints.push(where('price', '>=', filters.minPrice));
  if (filters.maxPrice !== undefined) constraints.push(where('price', '<=', filters.maxPrice));

  const sortMap: Record<string, [string, 'asc' | 'desc']> = {
    newest: ['createdAt', 'desc'],
    'price-asc': ['price', 'asc'],
    'price-desc': ['price', 'desc'],
    popular: ['sold', 'desc'],
    rating: ['rating', 'desc'],
  };
  const [sortField, sortDir] = sortMap[filters.sortBy ?? 'newest'] ?? ['createdAt', 'desc'];
  constraints.push(orderBy(sortField, sortDir), limit(pageSize));
  if (lastDoc) constraints.push(startAfter(lastDoc));

  const q = query(collection(db, PRODUCTS), ...constraints);
  const snap = await getDocs(q);
  return {
    products: snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)),
    lastDoc: snap.docs[snap.docs.length - 1],
    hasMore: snap.docs.length === pageSize,
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const q = query(collection(db, PRODUCTS), where('slug', '==', slug), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Product;
}

export async function getProductById(id: string): Promise<Product | null> {
  const snap = await getDoc(doc(db, PRODUCTS, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Product;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const q = query(collection(db, PRODUCTS), where('isFeatured', '==', true), limit(8));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
}

export async function getNewArrivals(): Promise<Product[]> {
  const q = query(collection(db, PRODUCTS), where('isNew', '==', true), orderBy('createdAt', 'desc'), limit(8));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
}

export async function getBestSellers(): Promise<Product[]> {
  const q = query(collection(db, PRODUCTS), where('isBestSeller', '==', true), orderBy('sold', 'desc'), limit(8));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
}

export async function getRelatedProducts(category: string, excludeId: string): Promise<Product[]> {
  const q = query(collection(db, PRODUCTS), where('category', '==', category), limit(5));
  const snap = await getDocs(q);
  return snap.docs.filter(d => d.id !== excludeId).slice(0, 4).map(d => ({ id: d.id, ...d.data() } as Product));
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, PRODUCTS), { ...product, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  return ref.id;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  await updateDoc(doc(db, PRODUCTS, id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, PRODUCTS, id));
}

export async function searchProducts(searchTerm: string): Promise<Product[]> {
  // Firestore doesn't support full-text search natively; use a simple prefix match on name
  const q = query(collection(db, PRODUCTS), orderBy('name'), limit(20));
  const snap = await getDocs(q);
  const lower = searchTerm.toLowerCase();
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() } as Product))
    .filter(p => p.name.toLowerCase().includes(lower) || p.description.toLowerCase().includes(lower));
}

// ─── Image Upload ─────────────────────────────────────────────────────────────

export async function uploadProductImage(
  file: File,
  onProgress?: (pct: number) => void
): Promise<string> {
  const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file);
    task.on('state_changed',
      snap => onProgress?.(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      reject,
      async () => resolve(await getDownloadURL(task.snapshot.ref))
    );
  });
}

export async function deleteProductImage(url: string): Promise<void> {
  try { await deleteObject(ref(storage, url)); } catch { /* already deleted */ }
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = await addDoc(collection(db, ORDERS), { ...order, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  // Decrease stock for each item
  for (const item of order.items) {
    await updateDoc(doc(db, PRODUCTS, item.productId), {
      stock: increment(-item.quantity),
      sold: increment(item.quantity),
    });
  }
  return ref.id;
}

export async function getOrderById(id: string): Promise<Order | null> {
  const snap = await getDoc(doc(db, ORDERS, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Order;
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const q = query(collection(db, ORDERS), where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
}

export async function getAllOrders(status?: string): Promise<Order[]> {
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];
  if (status) constraints.unshift(where('status', '==', status));
  const snap = await getDocs(query(collection(db, ORDERS), ...constraints));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
}

export async function updateOrderStatus(id: string, status: string): Promise<void> {
  await updateDoc(doc(db, ORDERS, id), { status, updatedAt: serverTimestamp() });
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function createUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  await setDoc(doc(db, USERS, uid), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, USERS, uid));
  if (!snap.exists()) return null;
  return { uid: snap.id, ...snap.data() } as UserProfile;
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  await updateDoc(doc(db, USERS, uid), { ...data, updatedAt: serverTimestamp() });
}

export async function toggleWishlistItem(uid: string, productId: string, add: boolean): Promise<void> {
  await updateDoc(doc(db, USERS, uid), {
    wishlist: add ? arrayUnion(productId) : arrayRemove(productId),
    updatedAt: serverTimestamp(),
  });
}

export async function getAllUsers(): Promise<UserProfile[]> {
  const snap = await getDocs(collection(db, USERS));
  return snap.docs.map(d => ({ uid: d.id, ...d.data() } as UserProfile));
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export async function getProductReviews(productId: string): Promise<Review[]> {
  const q = query(collection(db, REVIEWS), where('productId', '==', productId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Review));
}

export async function addReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<void> {
  await addDoc(collection(db, REVIEWS), { ...review, createdAt: serverTimestamp() });
  // Update product rating
  const reviews = await getProductReviews(review.productId);
  const allRatings = [...reviews.map(r => r.rating), review.rating];
  const avg = allRatings.reduce((a, b) => a + b, 0) / allRatings.length;
  await updateDoc(doc(db, PRODUCTS, review.productId), {
    rating: Math.round(avg * 10) / 10,
    reviewCount: allRatings.length,
  });
}

// ─── Coupons ──────────────────────────────────────────────────────────────────

export async function validateCoupon(code: string, orderTotal: number): Promise<Coupon | null> {
  const q = query(collection(db, COUPONS), where('code', '==', code.toUpperCase()), where('isActive', '==', true));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const coupon = { id: snap.docs[0].id, ...snap.docs[0].data() } as Coupon;
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return null;
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return null;
  if (coupon.minOrderAmount && orderTotal < coupon.minOrderAmount) return null;
  return coupon;
}

export async function useCoupon(id: string): Promise<void> {
  await updateDoc(doc(db, COUPONS, id), { usedCount: increment(1) });
}

// ─── Admin Stats ──────────────────────────────────────────────────────────────

export async function getAdminStats(): Promise<AdminStats> {
  const [ordersSnap, productsSnap, usersSnap] = await Promise.all([
    getDocs(collection(db, ORDERS)),
    getDocs(collection(db, PRODUCTS)),
    getDocs(collection(db, USERS)),
  ]);
  const orders = ordersSnap.docs.map(d => d.data() as Order);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayOrders = orders.filter(o => new Date(o.createdAt) >= today);
  return {
    totalOrders: orders.length,
    totalRevenue: orders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + o.total, 0),
    totalProducts: productsSnap.size,
    totalUsers: usersSnap.size,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    revenueToday: todayOrders.reduce((s, o) => s + o.total, 0),
    ordersToday: todayOrders.length,
  };
}
