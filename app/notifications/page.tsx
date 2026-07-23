'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Bell, 
  ShoppingBag, 
  Package, 
  Truck, 
  Tag,
  X,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'order',
      icon: <Package size={20} className="text-blue-500" />,
      title: 'Order Delivered',
      message: 'Your order #RANA-001 has been delivered successfully.',
      time: '2 hours ago',
      read: false,
    },
    {
      id: 2,
      type: 'promotion',
      icon: <Tag size={20} className="text-yellow-500" />,
      title: 'Summer Sale!',
      message: 'Get up to 50% off on selected leather products. Hurry up!',
      time: '1 day ago',
      read: false,
    },
    {
      id: 3,
      type: 'shipping',
      icon: <Truck size={20} className="text-green-500" />,
      title: 'Order Shipped',
      message: 'Your order #RANA-002 has been shipped and is on its way.',
      time: '2 days ago',
      read: true,
    },
    {
      id: 4,
      type: 'order',
      icon: <Clock size={20} className="text-yellow-500" />,
      title: 'Order Confirmed',
      message: 'Your order #RANA-003 has been confirmed and is being processed.',
      time: '3 days ago',
      read: true,
    },
  ]);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1A0F0A] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#8B3A1A] to-[#1A0F0A] text-white sticky top-0 z-10">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/settings" className="hover:opacity-80 transition">
                <ArrowLeft size={24} />
              </Link>
              <h1 className="text-xl font-semibold">Notifications</h1>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-white/80 hover:text-white transition"
              >
                Mark all read
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container-custom mt-4">
        {notifications.length === 0 ? (
          <div className="bg-white dark:bg-[#2C1810] rounded-2xl shadow-sm p-12 text-center border border-gray-100 dark:border-[#3A2A24]">
            <Bell size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h2 className="text-xl font-semibold text-[#1A0F0A] dark:text-[#F5EFE6]">No Notifications</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">You're all caught up!</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white dark:bg-[#2C1810] rounded-2xl shadow-sm mb-3 border transition ${
                notification.read
                  ? 'border-gray-100 dark:border-[#3A2A24]'
                  : 'border-[#D4AF37]/50 dark:border-[#D4AF37]/30 bg-[#D4AF37]/5'
              }`}
            >
              <div className="p-4 flex items-start gap-3">
                <div className="p-2 bg-gray-100 dark:bg-[#1A0F0A] rounded-lg flex-shrink-0">
                  {notification.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-[#1A0F0A] dark:text-[#F5EFE6]">{notification.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{notification.time}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-[#8B3A1A] dark:text-[#D4AF37] hover:opacity-80 transition"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}