import { create } from 'zustand';

interface CartItem {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
  size?: string;
  color?: string;
}

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addItem: (productId: number, quantity: number, size?: string, color?: string) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  // Fetch cart from database
  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/cart');
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      const data = await response.json();
      set({ items: data.items || [] });
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      set({ error: 'Failed to load cart' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Add item to cart
  addItem: async (productId, quantity, size, color) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity, size, color }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add to cart');
      }
      
      await get().fetchCart(); // Refresh cart
    } catch (error: any) {
      console.error('Failed to add to cart:', error);
      set({ error: error.message || 'Failed to add item to cart' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Remove item from cart
  removeItem: async (productId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/cart?productId=${productId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove from cart');
      }
      
      await get().fetchCart();
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      set({ error: 'Failed to remove item' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Update quantity
  updateQuantity: async (productId, quantity) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }
      
      await get().fetchCart();
    } catch (error) {
      console.error('Failed to update quantity:', error);
      set({ error: 'Failed to update quantity' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Clear cart
  clearCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }
      
      set({ items: [] });
    } catch (error) {
      console.error('Failed to clear cart:', error);
      set({ error: 'Failed to clear cart' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Get total number of items
  getTotalItems: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.quantity, 0);
  },

  // Get total price
  getTotalPrice: () => {
    const { items } = get();
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  },
}));
