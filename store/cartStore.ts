import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isInCart: (id: number) => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const { items } = get();
        const existingIndex = items.findIndex((i) => i.id === item.id);
        
        if (existingIndex > -1) {
          const updatedItems = [...items];
          updatedItems[existingIndex].quantity += item.quantity;
          set({ items: updatedItems });
        } else {
          set({ items: [...items, item] });
        }
        
        // Dispatch event for navbar update
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('cartUpdated'));
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('cartUpdated'));
        }
      },

      updateQuantity: (id, quantity) => {
        const { items } = get();
        const index = items.findIndex((item) => item.id === id);
        if (index > -1 && quantity > 0) {
          const updatedItems = [...items];
          updatedItems[index].quantity = quantity;
          set({ items: updatedItems });
        } else if (quantity === 0) {
          get().removeItem(id);
        }
        
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('cartUpdated'));
        }
      },

      clearCart: () => {
        set({ items: [] });
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('cartUpdated'));
        }
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      isInCart: (id) => {
        return get().items.some((item) => item.id === id);
      },
    }),
    {
      name: 'rana-leathers-cart', // localStorage key
    }
  )
);