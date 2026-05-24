'use client';

import { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Minus, Plus, ChevronLeft } from "lucide-react";

const product = {
  id: 6,
  name: "Leather Backpack",
  price: 12999,
  rating: 4.8,
  description: "Versatile backpack perfect for daily use or travel. Made from soft, durable leather with a spacious main compartment and padded laptop sleeve.",
  features: [
    "Soft genuine leather",
    "Drawstring closure with magnetic flap",
    "Padded laptop compartment (fits up to 15-inch)",
    "Adjustable shoulder straps",
    "Interior zip pocket",
    "Durable metal hardware"
  ],
  colors: ["Brown", "Black", "Tan"],
  image: "/images/products/backpack.jpg",
  slug: "leather-backpack"
};

export default function BackpackDetailPage() {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");

  const addToCart = () => {
    const existingCart = localStorage.getItem("cart");
    const cart = existingCart ? JSON.parse(existingCart) : [];
    
    const existingIndex = cart.findIndex((item: any) => item.id === product.id);
    
    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image,
        slug: product.slug,
      });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`Added ${quantity} x ${product.name} to cart!`);
  };

  return (
    <div className="container-custom py-12">
      <Link href="/products" className="inline-flex items-center gap-2 text-[#8B3A1A] hover:text-[#D4AF37] transition mb-6">
        <ChevronLeft size={20} /> Back to Products
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div>
          <div className="h-96 bg-gradient-to-br from-[#8B3A1A] to-[#D4AF37] rounded-lg flex items-center justify-center overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                if (target.parentElement) {
                  target.parentElement.innerHTML = '<span class="text-6xl">🎒</span>';
                }
              }}
            />
          </div>
          <div className="flex gap-2 mt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-[#D4AF37]">
                <span className="text-gray-400 text-xs">View</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#1A0F0A] mb-2">{product.name}</h1>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="flex text-yellow-500">
              {"★".repeat(Math.floor(product.rating))}
              {"☆".repeat(5 - Math.floor(product.rating))}
            </div>
            <span className="text-gray-500">({product.rating} rating)</span>
          </div>
          
          <div className="mb-4">
            <span className="text-3xl font-bold text-[#8B3A1A]">Rs. {product.price.toLocaleString()}</span>
          </div>
          
          <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
          
          {/* Colors */}
          <div className="mb-6">
            <h3 className="font-semibold text-[#1A0F0A] mb-2">Select Color: {selectedColor || "Choose one"}</h3>
            <div className="flex flex-wrap gap-3">
              {product.colors.map((color) => (
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
          
          {/* Quantity */}
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
          
          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={addToCart}
              className="flex-1 bg-[#8B3A1A] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1A0F0A] transition flex items-center justify-center gap-2"
            >
              <ShoppingBag size={20} /> Add to Cart
            </button>
            <button className="p-3 border rounded-lg hover:bg-gray-50 transition">
              <Heart size={20} className="text-[#8B3A1A]" />
            </button>
          </div>
          
          {/* Features */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="font-bold text-[#1A0F0A] mb-3">Key Features</h3>
            <ul className="space-y-2">
              {product.features.map((feature, i) => (
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

