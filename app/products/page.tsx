'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

const products = [
  { 
    id: 1, 
    name: "Premium Leather Jacket", 
    category: "jackets", 
    price: 29999, 
    originalPrice: 44999, 
    rating: 4.8, 
    image: "/images/products/jacket.jpg",
    slug: "premium-leather-jacket" 
  },
  { 
    id: 2, 
    name: "Handcrafted Tote Bag", 
    category: "bags", 
    price: 15999, 
    rating: 4.9, 
    image: "/images/products/bag.jpg",
    slug: "handcrafted-tote-bag" 
  },
  { 
    id: 3, 
    name: "Classic Leather Belt", 
    category: "belts", 
    price: 3999, 
    originalPrice: 5999, 
    rating: 4.7, 
    image: "/images/products/belt.jpg",
    slug: "classic-leather-belt" 
  },
  { 
    id: 4, 
    name: "Minimalist Wallet", 
    category: "wallets", 
    price: 2499, 
    originalPrice: 3999, 
    rating: 4.9, 
    image: "/images/products/wallet.jpg",
    slug: "minimalist-wallet" 
  },
  { 
    id: 5, 
    name: "Leather Chelsea Boots", 
    category: "shoes", 
    price: 18999, 
    originalPrice: 27999, 
    rating: 4.8, 
    image: "/images/products/boots.jpg",
    slug: "leather-chelsea-boots" 
  },
  { 
    id: 6, 
    name: "Leather Backpack", 
    category: "bags", 
    price: 12999, 
    rating: 4.8, 
    image: "/images/products/backpack.jpg",
    slug: "leather-backpack" 
  },
];

const categories = ["all", "jackets", "bags", "belts", "wallets", "shoes"];

const getCategoryIcon = (category: string) => {
  switch(category) {
    case "jackets": return "🧥";
    case "bags": return "👜";
    case "belts": return "👔";
    case "wallets": return "👛";
    case "shoes": return "👞";
    default: return "👜";
  }
};

export default function ProductsPage() {
  const router = useRouter();
  const [category, setCategory] = useState("all");
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const [addedProduct, setAddedProduct] = useState<number | null>(null);
  
  const addItemToCart = useCartStore((state) => state.addItem);
  
  const filteredProducts = category === "all" 
    ? products 
    : products.filter(p => p.category === category);

  const handleImageError = (id: number) => {
    setImgErrors(prev => ({ ...prev, [id]: true }));
  };

  const handleAddToCart = (e: React.MouseEvent, product: typeof products[0]) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItemToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      slug: product.slug,
    });
    
    setAddedProduct(product.id);
    setTimeout(() => setAddedProduct(null), 2000);
    
    // Navigate to cart page
    router.push('/cart');
  };

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl md:text-4xl font-serif font-light text-[#1A0F0A] text-center mb-4">Our Products</h1>
      <div className="w-12 h-px bg-[#D4AF37] mx-auto mb-8"></div>
      
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-lg capitalize transition ${
              category === cat 
                ? "bg-[#8B3A1A] text-white" 
                : "bg-gray-200 text-[#2C1810] hover:bg-[#D4AF37]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition group">
            <Link href={`/products/${product.slug}`}>
              <div className="relative h-64 overflow-hidden bg-gradient-to-br from-[#8B3A1A] to-[#D4AF37] flex items-center justify-center">
                {!imgErrors[product.id] ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={() => handleImageError(product.id)}
                  />
                ) : null}
                {imgErrors[product.id] && (
                  <span className="text-6xl opacity-70">
                    {getCategoryIcon(product.category)}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="absolute top-2 left-2 bg-[#D4AF37] text-[#1A0F0A] text-xs font-bold px-2 py-1 rounded">
                    SALE
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-[#2C1810] hover:text-[#8B3A1A] transition">{product.name}</h3>
                <div className="flex items-center mt-2">
                  <span className="text-xl font-bold text-[#8B3A1A]">Rs. {product.price.toLocaleString()}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through ml-2">Rs. {product.originalPrice.toLocaleString()}</span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex text-yellow-500">
                    {"★".repeat(Math.floor(product.rating))}
                    {"☆".repeat(5 - Math.floor(product.rating))}
                  </div>
                  <button 
                    onClick={(e) => handleAddToCart(e, product)}
                    className="bg-[#8B3A1A] text-white p-2 rounded-full hover:bg-[#1A0F0A] transition"
                  >
                    <ShoppingBag size={18} />
                  </button>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}