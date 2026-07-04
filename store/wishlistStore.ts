import { create } from 'zustand';

interface WishlistItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  slug: string;
}

interface WishlistStore {
  items: WishlistItem[];
  isLoading: boolean;
  fetchWishlist: () => Promise<void>;
  addItem: (productId: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
  getWishlistCount: () => number;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  isLoading: false,

  fetchWishlist: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch('/api/wishlist');
      if (response.ok) {
        const data = await response.json();
        set({ items: data.items || [] });
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (productId: number) => {
    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      if (response.ok) {
        await get().fetchWishlist();
      }
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    }
  },

  removeItem: async (productId: number) => {
    try {
      const response = await fetch(`/api/wishlist?productId=${productId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await get().fetchWishlist();
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  },

  isInWishlist: (productId: number) => {
    const { items } = get();
    return items.some((item) => item.id === productId);
  },

  getWishlistCount: () => {
    const { items } = get();
    return items.length;
  },
}));
