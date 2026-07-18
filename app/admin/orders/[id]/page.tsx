'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, User, Mail, Phone, MapPin, CreditCard, Calendar, Home } from 'lucide-react';

interface Order {
  id: number;
  order_number: string;
  total_amount: number;
  status: string;
  payment_method: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_city: string;
  customer_country: string;
  customer_postal_code: string;
  shipping_address: string;
  order_notes: string;
  created_at: string;
}

interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  size: string;
  color: string;
  image_url: string;
  category: string;
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/admin/orders/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
        setItems(data.items || []);
      } else {
        alert('Order not found');
        router.push('/admin/orders');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: params.id, status: newStatus }),
      });
      if (response.ok) {
        setOrder({ ...order!, status: newStatus });
      } else {
        alert('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-serif text-[#1A0F0A]">Order not found</h2>
        <Link href="/admin/orders" className="text-[#8B3A1A] hover:underline mt-4 inline-block">
          Back to Orders
        </Link>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/orders" className="text-[#8B3A1A] hover:text-[#D4AF37] transition flex items-center gap-2">
          <ArrowLeft size={20} /> Back to Orders
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#D4AF37]/10">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-serif text-[#1A0F0A]">Order #{order.order_number}</h1>
            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
              <Calendar size={16} />
              {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
            <select
              value={order.status}
              onChange={(e) => updateOrderStatus(e.target.value)}
              disabled={updating}
              className="px-3 py-1 border rounded-lg focus:outline-none focus:border-[#D4AF37] text-sm"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Info */}
          <div className="lg:col-span-1 bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-[#1A0F0A] mb-4 flex items-center gap-2">
              <User size={18} /> Customer Information
            </h3>
            <div className="space-y-3 text-sm">
              <p><strong>Name:</strong> {order.customer_name || 'Guest'}</p>
              <p className="flex items-center gap-2"><Mail size={14} /> {order.customer_email || 'No email'}</p>
              <p className="flex items-center gap-2"><Phone size={14} /> {order.customer_phone || 'No phone'}</p>
              <p className="flex items-center gap-2"><MapPin size={14} /> {order.customer_city || 'N/A'}, {order.customer_country || 'N/A'}</p>
              {order.customer_postal_code && <p><strong>Postal Code:</strong> {order.customer_postal_code}</p>}
              <p><strong>Address:</strong> {order.shipping_address || 'N/A'}</p>
              {order.order_notes && <p><strong>Notes:</strong> {order.order_notes}</p>}
              <p className="flex items-center gap-2"><CreditCard size={14} /> <strong>Payment:</strong> {order.payment_method || 'N/A'}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-[#1A0F0A] mb-4 flex items-center gap-2">
              <Package size={18} /> Order Items ({items.length})
            </h3>
            <div className="space-y-3">
              {items.length === 0 ? (
                <p className="text-gray-500">No items found</p>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image_url || '/images/products/jacket.jpg'} 
                        alt={item.product_name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[#1A0F0A]">{item.product_name}</p>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        <span>Qty: {item.quantity}</span>
                        {item.size && <span>Size: {item.size}</span>}
                        {item.color && <span>Color: {item.color}</span>}
                        <span className="font-semibold text-[#8B3A1A]">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-[#8B3A1A]">Rs. {order.total_amount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}