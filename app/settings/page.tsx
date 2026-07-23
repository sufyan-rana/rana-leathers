'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  Moon, 
  Sun, 
  User, 
  Mail, 
  Shield, 
  Lock, 
  Check,
  Eye,
  EyeOff,
  ArrowLeft,
  Save,
  AlertCircle,
  CheckCircle,
  LogOut,
  ChevronRight,
  Bell,
  Globe,
  Smartphone,
  CreditCard,
  MapPin,
  HelpCircle,
  Settings as SettingsIcon,
  UserCircle,
  Users,
  ShoppingBag,
  Heart,
  Star,
  Clock,
  Gift,
  MessageCircle,
  Share2,
  Camera
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (selectedTheme: 'light' | 'dark') => {
    if (selectedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', selectedTheme);
  };

  const handleThemeChange = (selectedTheme: 'light' | 'dark') => {
    setTheme(selectedTheme);
    applyTheme(selectedTheme);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await fetch('/api/admin/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email,
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordMessage({ type: 'success', text: '✅ Password updated successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setShowPasswordModal(false), 1500);
      } else {
        setPasswordMessage({ type: 'error', text: data.error || '❌ Failed to update password' });
      }
    } catch (error) {
      setPasswordMessage({ type: 'error', text: '❌ Something went wrong' });
    } finally {
      setPasswordLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  // Menu items similar to Daraz
  const menuItems = [
    { icon: <User size={20} />, label: 'My Profile', href: '/profile', badge: 'Edit' },
    { icon: <ShoppingBag size={20} />, label: 'My Orders', href: '/orders', badge: 'View All' },
    { icon: <Heart size={20} />, label: 'Wishlist', href: '/wishlist', badge: `${0} items` },
    { icon: <MapPin size={20} />, label: 'Address Book', href: '/addresses', badge: 'Manage' },
    { icon: <CreditCard size={20} />, label: 'Payment Methods', href: '/payment-methods', badge: 'Add' },
    { icon: <Bell size={20} />, label: 'Notifications', href: '/notifications', badge: 'On' },
    { icon: <Globe size={20} />, label: 'Language', href: '/language', badge: 'English' },
    { icon: <Moon size={20} />, label: 'Dark Mode', href: '#', badge: theme === 'dark' ? 'On' : 'Off' },
    { icon: <Shield size={20} />, label: 'Privacy & Security', href: '/privacy', badge: '' },
    { icon: <HelpCircle size={20} />, label: 'Help & Support', href: '/support', badge: '' },
    { icon: <Share2 size={20} />, label: 'Share App', href: '#', badge: '' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1A0F0A] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#8B3A1A] to-[#1A0F0A] text-white sticky top-0 z-10">
        <div className="container-custom py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:opacity-80 transition">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-xl font-semibold">Settings</h1>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="container-custom mt-4">
        <div className="bg-white dark:bg-[#2C1810] rounded-2xl shadow-sm p-6 flex items-center gap-4 border border-gray-100 dark:border-[#3A2A24]">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8B3A1A] to-[#D4AF37] flex items-center justify-center text-2xl font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <button className="absolute -bottom-1 -right-1 bg-[#D4AF37] rounded-full p-1 text-white hover:bg-[#B8943A] transition">
              <Camera size={14} />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-[#1A0F0A] dark:text-[#F5EFE6]">{user?.name || 'User'}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
            <span className="text-xs bg-[#D4AF37] text-[#1A0F0A] px-2 py-0.5 rounded-full mt-1 inline-block">
              {user?.role || 'User'}
            </span>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </div>
      </div>

      {/* Menu Items */}
      <div className="container-custom mt-4">
        <div className="bg-white dark:bg-[#2C1810] rounded-2xl shadow-sm border border-gray-100 dark:border-[#3A2A24] overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                if (item.label === 'Dark Mode') {
                  handleThemeChange(theme === 'light' ? 'dark' : 'light');
                } else if (item.label === 'Share App') {
                  if (navigator.share) {
                    navigator.share({
                      title: 'RANA LEATHER\'S',
                      text: 'Check out RANA LEATHER\'S - Premium handcrafted leather products!',
                      url: window.location.origin,
                    });
                  }
                } else if (item.label === 'Change Password') {
                  setShowPasswordModal(true);
                } else if (item.href && item.href !== '#') {
                  router.push(item.href);
                }
              }}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-[#1A0F0A] transition border-b border-gray-100 dark:border-[#3A2A24] last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="text-[#8B3A1A] dark:text-[#D4AF37]">
                  {item.icon}
                </div>
                <span className="text-sm text-[#1A0F0A] dark:text-[#F5EFE6]">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className={`text-xs ${
                    item.label === 'Dark Mode' 
                      ? theme === 'dark' ? 'text-[#D4AF37]' : 'text-gray-400'
                      : 'text-gray-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* App Version */}
      <div className="container-custom mt-4 text-center">
        <p className="text-xs text-gray-400 dark:text-gray-500">RANA LEATHER'S v2.0.1</p>
      </div>

      {/* Logout Button */}
      <div className="container-custom mt-4">
        <button
          onClick={logout}
          className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 py-3 rounded-2xl font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition flex items-center justify-center gap-2"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-[#2C1810] rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-serif text-[#1A0F0A] dark:text-[#F5EFE6]">Change Password</h2>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-500 hover:text-[#1A0F0A] dark:hover:text-[#F5EFE6]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37] dark:bg-[#1A0F0A] dark:border-[#3A2A24] dark:text-[#F5EFE6] pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37] dark:bg-[#1A0F0A] dark:border-[#3A2A24] dark:text-[#F5EFE6] pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37] dark:bg-[#1A0F0A] dark:border-[#3A2A24] dark:text-[#F5EFE6] pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {passwordMessage && (
                <div className={`p-3 rounded-lg text-sm ${
                  passwordMessage.type === 'success' 
                    ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400' 
                    : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {passwordMessage.text}
                </div>
              )}

              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full bg-gradient-to-r from-[#8B3A1A] to-[#1A0F0A] hover:from-[#6B2A10] hover:to-[#1A0F0A] text-white py-2 rounded-lg font-semibold transition disabled:opacity-50"
              >
                {passwordLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}