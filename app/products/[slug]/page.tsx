"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Heart, ShoppingBag, Minus, Plus, ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";

// Product data
const products: Record<string, any> = {
  "premium-leather-jacket": {
    id: 1,
    name: "Premium Leather Jacket",
    price: 29999,
    originalPrice: 44999,
    rating: 4.8,
    image: "/images/products/jacket.jpg",
    slug: "premium-leather-jacket",
    description: "Handcrafted from full-grain buffalo leather. Features YKK zippers, quilted lining, and multiple pockets.",
    features: ["100% genuine buffalo leather", "YKK heavy-duty zippers", "Quilted polyester lining"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Brown", "Black"],
  },
  "handcrafted-tote-bag": {
    id: 2,
    name: "Handcrafted Tote Bag",
    price: 15999,
    rating: 4.9,
    image: "/images/products/bag.jpg",
    slug: "handcrafted-tote-bag",
    description: "Elegant tote bag made from soft full-grain leather.",
    features: ["Full-grain cowhide", "Cotton canvas lining"],
    sizes: ["One Size"],
    colors: ["Brown", "Tan", "Black"],
  },
  "classic-leather-belt": {
    id: 3,
    name: "Classic Leather Belt",
    price: 3999,
    originalPrice: 5999,
    rating: 4.7,
    image: "/images/products/belt.jpg",
    slug: "classic-leather-belt",
    description: "Timeless leather belt with premium brass buckle.",
    features: ["Full-grain leather", "Solid brass buckle"],
    sizes: ["30", "32", "34", "36", "38", "40"],
    colors: ["Brown", "Black"],
  },
  "minimalist-wallet": {
    id: 4,
    name: "Minimalist Wallet",
    price: 2499,
    originalPrice: 3999,
    rating: 4.9,
    image: "/images/products/wallet.jpg",
    slug: "minimalist-wallet",
    description: "Slim, RFID-blocking wallet for minimalists.",
    features: ["Vegetable-tanned leather", "RFID blocking", "6 card slots"],
    sizes: ["One Size"],
    colors: ["Brown", "Black", "Tan"],
  },
  "leather-chelsea-boots": {
    id: 5,
    name: "Leather Chelsea Boots",
    price: 18999,
    originalPrice: 27999,
    rating: 4.8,
    image: "/images/products/boots.jpg",
    slug: "leather-chelsea-boots",
    description: "Classic Chelsea boots with elastic side panels.",
    features: ["Pull-up leather", "Elastic side panels", "Cushioned insole"],
    sizes: ["39", "40", "41", "42", "43", "44"],
    colors: ["Brown", "Black"],
  },
  "leather-backpack": {
    id: 6,
    name: "Leather Backpack",
    price: 12999,
    rating: 4.8,
    image: "/images/products/backpack.jpg",
    slug: "leather-backpack",
    description: "Handcrafted full-grain leather backpack with a vintage finish.",
    features: ["Full-grain leather", "Adjustable shoulder straps", "Brass hardware", "Padded laptop sleeve", "Front buckle closure"],
    sizes: ["One Size"],
    colors: ["Brown", "Black", "Tan"],
  }
};

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = products[slug];
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);

  // Get the addItem function from the cart store
  const addItemToCart = useCartStore((state) => state.addItem);

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    // Add item to cart using Zustand store
    addItemToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image,
      slug: product.slug,
      size: selectedSize,
      color: selectedColor,
    });
    
    // Show feedback to user
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="container-custom py-12">
      <Link href="/products" className="inline-flex items-center gap-2 text-[#8B3A1A] hover:text-[#D4AF37] transition mb-6">
        <ChevronLeft size={20} /> Back to Products
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="relative h-96 rounded-lg overflow-hidden bg-gradient-to-br from-[#8B3A1A] to-[#D4AF37]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
        
        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#1A0F0A] mb-2">{product.name}</h1>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="flex text-yellow-500">
              {"★".repeat(Math.floor(product.rating))}
              {"☆".repeat(5 - Math.floor(product.rating))}
            </div>
            <span className="text-gray-500">({product.rating})</span>
          </div>
          
          <div className="mb-4">
            <span className="text-3xl font-bold text-[#8B3A1A]">Rs. {product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-lg text-gray-400 line-through ml-3">
                Rs. {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          
          <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
          
          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && product.sizes[0] !== "One Size" && (
            <div className="mb-4">
              <h3 className="font-semibold text-[#1A0F0A] mb-2">Select Size: {selectedSize || "Choose one"}</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-lg transition ${
                      selectedSize === size
                        ? "bg-[#8B3A1A] text-white border-[#8B3A1A]"
                        : "border-gray-300 hover:border-[#8B3A1A]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-[#1A0F0A] mb-2">Select Color: {selectedColor || "Choose one"}</h3>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color: string) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 transition ${
                      selectedColor === color
                        ? "border-[#D4AF37] ring-2 ring-offset-2 ring-[#D4AF37]"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-semibold text-[#1A0F0A]">Quantity:</span>
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                className="px-3 py-2 hover:bg-gray-100 transition"
              >
                <Minus size={16} />
              </button>
              <span className="px-4 py-2 w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 hover:bg-gray-100 transition"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                addedToCart 
                  ? "bg-green-600 text-white" 
                  : "bg-[#8B3A1A] hover:bg-[#1A0F0A] text-white"
              }`}
            >
              <ShoppingBag size={20} /> 
              {addedToCart ? "Added to Cart! ✓" : "Add to Cart"}
            </button>
            <button className="p-3 border rounded-lg hover:bg-gray-50 transition">
              <Heart size={20} className="text-[#8B3A1A]" />
            </button>
          </div>
          
          {/* Features List */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="font-bold text-[#1A0F0A] mb-3">Key Features</h3>
            <ul className="space-y-2">
              {product.features.map((feature: string, i: number) => (
                <li key={i} className="text-gray-600 flex items-center gap-2">
                  ✓ {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}