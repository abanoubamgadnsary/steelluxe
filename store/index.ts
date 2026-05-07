'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem, Product, UserProfile } from '@/types';
import { getShippingCost, getDiscountAmount } from '@/lib/utils';

// ─── Auth Store ───────────────────────────────────────────────────────────────
interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  setUser: (user: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  loading: true,
  setUser:    user    => set({ user }),
  setLoading: loading => set({ loading }),
}));

// ─── Cart Store ───────────────────────────────────────────────────────────────
interface CartState {
  items: CartItem[];
  couponCode: string;
  discountAmount: number;
  shippingGovernorate: string;

  addItem:       (product: Product, quantity?: number, size?: string) => void;
  removeItem:    (productId: string, size?: string) => void;
  updateQuantity:(productId: string, quantity: number, size?: string) => void;
  clearCart:     () => void;
  applyCoupon:   (code: string, amount: number) => void;
  removeCoupon:  () => void;
  setGovernorate:(gov: string) => void;

  subtotal:   () => number;
  shipping:   () => number;
  total:      () => number;
  itemCount:  () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: '',
      discountAmount: 0,
      shippingGovernorate: 'Cairo',

      addItem: (product, quantity = 1, size) => {
        set(state => {
          const existing = state.items.find(
            i => i.productId === product.id && i.selectedSize === size
          );
          if (existing) {
            return {
              items: state.items.map(i =>
                i.productId === product.id && i.selectedSize === size
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { productId: product.id, product, quantity, selectedSize: size }],
          };
        });
      },

      removeItem: (productId, size) => {
        set(state => ({
          items: state.items.filter(
            i => !(i.productId === productId && i.selectedSize === size)
          ),
        }));
      },

      updateQuantity: (productId, quantity, size) => {
        if (quantity <= 0) { get().removeItem(productId, size); return; }
        set(state => ({
          items: state.items.map(i =>
            i.productId === productId && i.selectedSize === size
              ? { ...i, quantity }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [], couponCode: '', discountAmount: 0 }),

      applyCoupon: (code, amount) => set({ couponCode: code, discountAmount: amount }),
      removeCoupon: () => set({ couponCode: '', discountAmount: 0 }),
      setGovernorate: gov => set({ shippingGovernorate: gov }),

      subtotal: () => get().items.reduce((s, i) => {
        const price = i.product.discount
          ? Math.round(i.product.price * (1 - i.product.discount / 100))
          : i.product.price;
        return s + price * i.quantity;
      }, 0),

      shipping: () => get().items.length > 0
        ? getShippingCost(get().shippingGovernorate)
        : 0,

      total: () => {
        const sub = get().subtotal();
        const ship = get().shipping();
        const disc = get().discountAmount;
        return Math.max(0, sub + ship - disc);
      },

      itemCount: () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    { name: 'steelluxe-cart', storage: createJSONStorage(() => localStorage) }
  )
);

// ─── Wishlist Store ───────────────────────────────────────────────────────────
interface WishlistState {
  items: string[];
  toggle: (productId: string) => void;
  has:    (productId: string) => boolean;
  setItems: (ids: string[]) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle:   id => set(s => ({ items: s.items.includes(id) ? s.items.filter(i => i !== id) : [...s.items, id] })),
      has:      id => get().items.includes(id),
      setItems: ids => set({ items: ids }),
    }),
    { name: 'steelluxe-wishlist', storage: createJSONStorage(() => localStorage) }
  )
);

// ─── UI Store ─────────────────────────────────────────────────────────────────
interface UIState {
  cartOpen:   boolean;
  searchOpen: boolean;
  mobileMenuOpen: boolean;
  openCart:   () => void;
  closeCart:  () => void;
  openSearch: () => void;
  closeSearch:() => void;
  openMenu:   () => void;
  closeMenu:  () => void;
}

export const useUIStore = create<UIState>(set => ({
  cartOpen:       false,
  searchOpen:     false,
  mobileMenuOpen: false,
  openCart:    () => set({ cartOpen: true }),
  closeCart:   () => set({ cartOpen: false }),
  openSearch:  () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),
  openMenu:    () => set({ mobileMenuOpen: true }),
  closeMenu:   () => set({ mobileMenuOpen: false }),
}));
