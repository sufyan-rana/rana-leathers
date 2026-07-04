// app/cart/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2, ShoppingBag, Plus, Minus, ArrowLeft, Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';

export default function CartPage() {
  const { items, isLoading, fetchCart, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchCart();
  }, [fetchCart]);

  if (!mounted) {
    return (
      <div className="container-custom py-20 text-center">
        <Loader2 size={40} className="animate-spin mx-auto text-[#D4AF37]" />
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shipping = subtotal > 5000 ? 0 : 500;
  const total = subtotal + shipping;

  if (isLoading && items.length === 0) {
    return (
      <div className="container-custom py-20 text-center">
        <Loader2 size={40} className="animate-spin mx-auto text-[#D4AF37]" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-custom py-20 text-center">
        <div className="bg-white p-12 rounded-lg shadow-sm max-w-md mx-auto">
          <ShoppingBag size={64} className="mx-auto text-[#D4AF37] mb-4" />
          <h2 className="text-2xl font-serif text-[#1A0F0A] mb-4">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added any items yet.</p>
          <Link href="/products" className="inline-block bg-[#8B3A1A] text-white px-8 py-3 hover:bg-[#1A0F0A] transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl md:text-4xl font-serif font-light text-[#1A0F0A] text-center mb-4">Shopping Cart</h1>
      <div className="w-12 h-px bg-[#D4AF37] mx-auto mb-8"></div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 text-sm font-semibold text-gray-600">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-center">Total</div>
            </div>

            {items.map((item) => (
              <div key={item.product_id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b items-center">
                <div className="md:col-span-6 flex gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#8B3A1A] to-[#D4AF37] rounded flex items-center justify-center overflow-hidden">
                    <img
                      src={item.image || '/images/products/jacket.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <Link href={`/products/${item.slug}`}>
                      <h3 className="font-semibold text-[#1A0F0A] hover:text-[#8B3A1A] transition">
                        {item.name}
                      </h3>
                    </Link>
                    <div className="flex flex-wrap gap-1 text-xs text-gray-500">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </div>
                    <button
                      onClick={() => removeItem(item.product_id)}
                      className="text-xs text-red-500 hover:text-red-700 mt-1 flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2 text-left md:text-center">
                  <span className="md:hidden text-gray-500 text-sm mr-2">Price:</span>
                  Rs. {item.price.toLocaleString()}
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center gap-2 md:justify-center">
                    <span className="md:hidden text-gray-500 text-sm mr-2">Qty:</span>
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-7 h-7 border rounded flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      className="w-7 h-7 border rounded flex items-center justify-center hover:bg-gray-100 transition"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2 text-left md:text-center font-semibold text-[#8B3A1A]">
                  <span className="md:hidden text-gray-500 text-sm mr-2">Total:</span>
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6">
            <Link href="/products" className="text-[#8B3A1A] hover:text-[#D4AF37] transition flex items-center gap-2">
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
            <button
              onClick={clearCart}
              className="text-red-500 hover:text-red-700 text-sm transition"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-6 h-fit">
          <h2 className="text-xl font-serif text-[#1A0F0A] mb-4">Order Summary</h2>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span>{shipping === 0 ? "Free" : `Rs. ${shipping}`}</span>
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-[#8B3A1A]">Rs. {total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full bg-[#8B3A1A] text-white py-3 hover:bg-[#1A0F0A] transition block text-center"
          >
            Proceed to Checkout
          </Link>
          
          <p className="text-xs text-gray-500 text-center mt-3">
            Free shipping on orders over Rs. 5,000
          </p>
        </div>
      </div>
    </div>
  );
}