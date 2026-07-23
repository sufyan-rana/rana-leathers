'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  ArrowLeft, 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  XCircle,
  ChevronRight,
  ShoppingBag
} from 'lucide-react';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading orders
    setTimeout(() => {
      setOrders([
        {
          id: 1,
          orderNumber: 'RANA-001',
          date: '2026-07-20',
          total: 29999,
          status: 'delivered',
          items: [{ name: 'Premium Leather Jacket', quantity: 1 }],
        },
        {
          id: 2,
          orderNumber: 'RANA-002',
          date: '2026-07-15',
          total: 15999,
          status: 'shipped',
          items: [{ name: 'Handcrafted Tote Bag', quantity: 1 }],
        },
        {
          id: 3,
          orderNumber: 'RANA-003',
          date: '2026-07-10',
          total: 3999,
          status: 'pending',
          items: [{ name: 'Classic Leather Belt', quantity: 2 }],
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'delivered': return <CheckCircle className="text-green-500" size={20} />;
      case 'shipped': return <Truck className="text-blue-500" size={20} />;
      case 'pending': return <Clock className="text-yellow-500" size={20} />;
      case 'cancelled': return <XCircle className="text-red-500" size={20} />;
      default: return <Package className="text-gray-500" size={20} />;
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'delivered': return 'Delivered';
      case 'shipped': return 'Shipped';
      case 'pending': return 'Processing';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#1A0F0A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1A0F0A] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#8B3A1A] to-[#1A0F0A] text-white sticky top-0 z-10">
        <div className="container-custom py-4">
          <div className="flex items-center gap-4">
            <Link href="/settings" className="hover:opacity-80 transition">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-xl font-semibold">My Orders</h1>
          </div>
        </div>
      </div>

      <div className="container-custom mt-4">
        {orders.length === 0 ? (
          <div className="bg-white dark:bg-[#2C1810] rounded-2xl shadow-sm p-12 text-center border border-gray-100 dark:border-[#3A2A24]">
            <ShoppingBag size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h2 className="text-xl font-semibold text-[#1A0F0A] dark:text-[#F5EFE6]">No Orders Yet</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Start shopping to see your orders here</p>
            <Link href="/products" className="inline-block mt-4 bg-[#8B3A1A] text-white px-6 py-2 rounded-lg hover:bg-[#1A0F0A] transition">
              Browse Products
            </Link>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white dark:bg-[#2C1810] rounded-2xl shadow-sm mb-4 border border-gray-100 dark:border-[#3A2A24] overflow-hidden">
              <div className="p-4 border-b border-gray-100 dark:border-[#3A2A24] flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-[#1A0F0A] dark:text-[#F5EFE6]">
                    Order #{order.orderNumber}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  <span className={`text-sm font-medium ${
                    order.status === 'delivered' ? 'text-green-500' :
                    order.status === 'shipped' ? 'text-blue-500' :
                    order.status === 'pending' ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>
              <div className="p-4">
                {order.items.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-[#3A2A24] last:border-0">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-[#1A0F0A] rounded flex items-center justify-center">
                      <Package size={24} className="text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#1A0F0A] dark:text-[#F5EFE6]">{item.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-[#8B3A1A] dark:text-[#D4AF37]">
                      Rs. {(order.total / order.items.length).toLocaleString()}
                    </p>
                  </div>
                ))}
                <div className="mt-3 flex justify-between items-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                  <p className="text-lg font-bold text-[#8B3A1A] dark:text-[#D4AF37]">
                    Rs. {order.total.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-[#1A0F0A] flex justify-end">
                <button className="text-[#8B3A1A] dark:text-[#D4AF37] text-sm font-medium hover:opacity-80 transition flex items-center gap-1">
                  View Details <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}