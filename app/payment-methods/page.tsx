'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  CreditCard, 
  Plus, 
  Trash2, 
  Check,
  Smartphone,
  Building2,
  Wallet
} from 'lucide-react';

export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState([
    {
      id: 1,
      type: 'card',
      name: 'Visa ending in 4242',
      icon: <CreditCard size={20} className="text-blue-600" />,
      isDefault: true,
    },
    {
      id: 2,
      type: 'easypaisa',
      name: 'EasyPaisa - 0345*******',
      icon: <Smartphone size={20} className="text-green-600" />,
      isDefault: false,
    },
    {
      id: 3,
      type: 'jazzcash',
      name: 'JazzCash - 0321*******',
      icon: <Smartphone size={20} className="text-orange-500" />,
      isDefault: false,
    },
  ]);

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to remove this payment method?')) {
      setMethods(methods.filter(m => m.id !== id));
    }
  };

  const handleSetDefault = (id: number) => {
    setMethods(methods.map(m => ({
      ...m,
      isDefault: m.id === id
    })));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1A0F0A] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#8B3A1A] to-[#1A0F0A] text-white sticky top-0 z-10">
        <div className="container-custom py-4">
          <div className="flex items-center gap-4">
            <Link href="/settings" className="hover:opacity-80 transition">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-xl font-semibold">Payment Methods</h1>
          </div>
        </div>
      </div>

      <div className="container-custom mt-4">
        {/* Add New Button */}
        <button className="w-full bg-white dark:bg-[#2C1810] rounded-2xl shadow-sm p-4 border border-gray-100 dark:border-[#3A2A24] flex items-center justify-center gap-2 hover:shadow-md transition">
          <Plus size={20} className="text-[#8B3A1A] dark:text-[#D4AF37]" />
          <span className="font-medium text-[#8B3A1A] dark:text-[#D4AF37]">Add Payment Method</span>
        </button>

        {/* Payment Methods List */}
        {methods.map((method) => (
          <div key={method.id} className="bg-white dark:bg-[#2C1810] rounded-2xl shadow-sm mt-4 border border-gray-100 dark:border-[#3A2A24] overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-[#1A0F0A] rounded-lg">
                    {method.icon}
                  </div>
                  <div>
                    <p className="font-medium text-[#1A0F0A] dark:text-[#F5EFE6]">{method.name}</p>
                    {method.isDefault && (
                      <span className="text-xs bg-[#D4AF37] text-[#1A0F0A] px-2 py-0.5 rounded-full">Default</span>
                    )}
                  </div>
                </div>
                {method.isDefault && (
                  <Check size={20} className="text-[#D4AF37]" />
                )}
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-[#1A0F0A] flex gap-3 justify-end border-t border-gray-100 dark:border-[#3A2A24]">
              {!method.isDefault && (
                <button
                  onClick={() => handleSetDefault(method.id)}
                  className="text-[#8B3A1A] dark:text-[#D4AF37] text-sm font-medium hover:opacity-80 transition"
                >
                  Set as Default
                </button>
              )}
              <button
                onClick={() => handleDelete(method.id)}
                className="text-red-500 text-sm font-medium hover:opacity-80 transition flex items-center gap-1"
              >
                <Trash2 size={14} /> Remove
              </button>
            </div>
          </div>
        ))}

        {/* Info Card */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 mt-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Wallet size={20} className="text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Secure Payments</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Your payment information is encrypted and secure. We accept EasyPaisa, JazzCash, and Bank Transfer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}