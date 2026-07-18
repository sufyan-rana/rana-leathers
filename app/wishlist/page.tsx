'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Heart, ShoppingBag, Trash2, Check } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

const initialWishlist = [
  { id: 1, name: "Premium Leather Jacket", price: 29999, originalPrice: 44999, rating: 4.8, image: "/images/products/jacket.jpg", slug: "premium-leather-jacket" },
  { id: 2, name: "Handcrafted Tote Bag", price: 15999, rating: 4.9, image: "/images/products/bag.jpg", slug: "handcrafted-tote-bag" },
  { id: 3, name: "Leather Chelsea Boots", price: 18999, originalPrice: 27999, rating: 4.8, image: "/images/products/boots.jpg", slug: "leather-chelsea-boots" },
  { id: 4, name: "Classic Leather Belt", price: 3999, originalPrice: 5999, rating: 4.7, image: "/images/products/belt.jpg", slug: "classic-leather-belt" },
  { id: 5, name: "Minimalist Wallet", price: 2499, originalPrice: 3999, rating: 4.9, image: "/images/products/wallet.jpg", slug: "minimalist-wallet" },
  { id: 6, name: "Leather Backpack", price: 12999, rating: 4.8, image: "/images/products/backpack.jpg", slug: "leather-backpack" },
];

export default function WishlistPage() {
  const router = useRouter();
  const [wishlist, setWishlist] = useState(initialWishlist);
  const [addedToCartId, setAddedToCartId] = useState<number | null>(null);
  const { addItem } = useCartStore();

  const removeFromWishlist = (id: number) => {
    setWishlist(wishlist.filter(item => item.id !== id));
  };

  const addToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      slug: item.slug,
    });
    
    setAddedToCartId(item.id);
    
    // Navigate to cart page
    setTimeout(() => {
      router.push('/cart');
    }, 300);
  };

  if (wishlist.length === 0) {
    return (
      <div className="container-custom py-20 text-center">
        <Heart size={64} className="mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-serif text-[#1A0F0A] mb-4">Your Wishlist is Empty</h2>
        <p className="text-gray-500 mb-6">Save your favorite items here!</p>
        <Link href="/products" className="inline-block bg-[#8B3A1A] text-white px-8 py-3 hover:bg-[#1A0F0A] transition">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl md:text-4xl font-serif font-light text-[#1A0F0A] text-center mb-4">My Wishlist</h1>
      <div className="w-12 h-px bg-[#D4AF37] mx-auto mb-8"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((item) => (
          <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition group">
            <Link href={`/products/${item.slug}`}>
              <div className="h-64 bg-gradient-to-br from-[#8B3A1A] to-[#D4AF37] flex items-center justify-center relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                {item.originalPrice && (
                  <span className="absolute top-2 left-2 bg-[#D4AF37] text-[#1A0F0A] text-xs font-bold px-2 py-1 rounded">
                    SALE
                  </span>
                )}
                <button 
                  onClick={(e) => { e.preventDefault(); removeFromWishlist(item.id); }}
                  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition"
                >
                  <Trash2 size={18} className="text-red-500" />
                </button>
              </div>
            </Link>
            <div className="p-4">
              <Link href={`/products/${item.slug}`}>
                <h3 className="font-semibold text-[#1A0F0A] hover:text-[#8B3A1A] transition">{item.name}</h3>
              </Link>
              <div className="flex items-center mt-2 mb-2">
                <div className="flex text-yellow-500">
                  {"★".repeat(Math.floor(item.rating))}
                  {"☆".repeat(5 - Math.floor(item.rating))}
                </div>
                <span className="text-xs text-gray-500 ml-2">({item.rating})</span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div>
                  <span className="text-xl font-bold text-[#8B3A1A]">Rs. {item.price.toLocaleString()}</span>
                  {item.originalPrice && (
                    <span className="text-sm text-gray-400 line-through ml-2">Rs. {item.originalPrice.toLocaleString()}</span>
                  )}
                </div>
                <button 
                  onClick={() => addToCart(item)}
                  className={`p-2 rounded-full transition flex items-center justify-center min-w-[36px] ${
                    addedToCartId === item.id 
                      ? 'bg-green-500 text-white' 
                      : 'bg-[#8B3A1A] hover:bg-[#1A0F0A] text-white'
                  }`}
                >
                  {addedToCartId === item.id ? <Check size={18} /> : <ShoppingBag size={18} />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <Link href="/products" className="text-[#8B3A1A] hover:text-[#D4AF37] transition">
          Continue Shopping →
        </Link>
      </div>
    </div>
  );
}