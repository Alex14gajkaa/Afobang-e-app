'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type CartItemLocal = {
  id: string;
  product_id: string;
  name: string;
  price: number;
  sale_price: number | null;
  image: string;
  quantity: number;
  variant?: any;
  stock: number;
};

type CartStore = {
  items: CartItemLocal[];
  addItem: (item: CartItemLocal) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
};

type WishlistStore = {
  items: string[];
  toggleItem: (productId: string) => void;
  isWished: (productId: string) => boolean;
};

type UIStore = {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
};

const safeLocalStorage = createJSONStorage(() => {
  if (typeof window === 'undefined') {
    return {
      length: 0,
      clear: () => {},
      getItem: () => null,
      key: () => null,
      setItem: () => {},
      removeItem: () => {},
    } as Storage;
  }
  return localStorage;
});

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item: CartItemLocal) => {
        const existing = get().items.find(
          (i) => i.product_id === item.product_id && JSON.stringify(i.variant) === JSON.stringify(item.variant)
        );
        if (existing) {
          set((state) => ({
            items: state.items.map((i) =>
              i.id === existing.id
                ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) }
                : i
            ),
          }));
        } else {
          set((state) => ({ items: [...state.items, item] }));
        }
      },
      removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) } : i
          ),
        })),
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + (i.sale_price ?? i.price) * i.quantity, 0),
    }),
    { name: 'afobang-cart', storage: safeLocalStorage }
  )
);

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (productId) =>
        set((state) => ({
          items: state.items.includes(productId)
            ? state.items.filter((id) => id !== productId)
            : [...state.items, productId],
        })),
      isWished: (productId) => get().items.includes(productId),
    }),
    { name: 'afobang-wishlist', storage: safeLocalStorage }
  )
);

export const useUIStore = create<UIStore>((set) => ({
  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
}));
