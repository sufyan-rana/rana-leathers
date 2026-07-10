'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Save, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  DollarSign, 
  Package, 
  Shield,
  Truck,
  RefreshCw,
  Store,
  Instagram,
  Facebook,
  Twitter,
  Youtube
} from 'lucide-react';

interface Settings {
  siteName: string;
  siteDescription: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  storeHours: string;
  currency: string;
  shippingCost: number;
  freeShippingThreshold: number;
  taxRate: number;
  instagram: string;
  facebook: string;
  twitter: string;
  youtube: string;
}

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [settings, setSettings] = useState<Settings>({
    siteName: 'RANA LEATHER\'S',
    siteDescription: 'Premium handcrafted leather products since 2010',
    storeEmail: 'info@ranaleathers.com',
    storePhone: '+92 300 1234567',
    storeAddress: 'Sialkot, Pakistan',
    storeHours: 'Monday-Saturday: 9AM - 6PM',
    currency: 'Rs.',
    shippingCost: 500,
    freeShippingThreshold: 5000,
    taxRate: 0,
    instagram: 'https://instagram.com/ranaleathers',
    facebook: 'https://facebook.com/ranaleathers',
    twitter: 'https://twitter.com/ranaleathers',
    youtube: 'https://youtube.com/ranaleathers',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings || settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: '✅ Settings saved successfully!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: '❌ Failed to save settings' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Something went wrong' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof Settings, value: string | number) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  return (
    <div className="animate-fadeInUp">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-[#1A0F0A]">Settings</h1>
          <p className="text-gray-600">Manage your store settings and configurations</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-gradient-to-r from-[#8B3A1A] to-[#1A0F0A] hover:from-[#6B2A10] hover:to-[#1A0F0A] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-500 transform hover:scale-[1.02] disabled:opacity-50 shadow-lg"
        >
          {saving ? (
            <RefreshCw size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl mb-6 ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <p className={`text-sm text-center ${
            message.type === 'success' ? 'text-green-700' : 'text-red-700'
          }`}>
            {message.text}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Information */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#D4AF37]/10">
          <div className="flex items-center gap-2 mb-6">
            <Store size={20} className="text-[#8B3A1A]" />
            <h2 className="text-xl font-serif text-[#1A0F0A]">Store Information</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => handleChange('siteName', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Description</label>
              <input
                type="text"
                value={settings.siteDescription}
                onChange={(e) => handleChange('siteDescription', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#D4AF37]/10">
          <div className="flex items-center gap-2 mb-6">
            <Globe size={20} className="text-[#8B3A1A]" />
            <h2 className="text-xl font-serif text-[#1A0F0A]">Contact Information</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={settings.storeEmail}
                onChange={(e) => handleChange('storeEmail', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                value={settings.storePhone}
                onChange={(e) => handleChange('storePhone', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={settings.storeAddress}
                onChange={(e) => handleChange('storeAddress', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Hours</label>
              <input
                type="text"
                value={settings.storeHours}
                onChange={(e) => handleChange('storeHours', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>
        </div>

        {/* Store Policies */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#D4AF37]/10">
          <div className="flex items-center gap-2 mb-6">
            <Shield size={20} className="text-[#8B3A1A]" />
            <h2 className="text-xl font-serif text-[#1A0F0A]">Store Policies</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency Symbol</label>
              <input
                type="text"
                value={settings.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Cost (Rs.)</label>
              <input
                type="number"
                value={settings.shippingCost}
                onChange={(e) => handleChange('shippingCost', parseInt(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Free Shipping Threshold (Rs.)</label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => handleChange('freeShippingThreshold', parseInt(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
              <input
                type="number"
                value={settings.taxRate}
                onChange={(e) => handleChange('taxRate', parseFloat(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#D4AF37]/10">
          <div className="flex items-center gap-2 mb-6">
            <Share2 size={20} className="text-[#8B3A1A]" />
            <h2 className="text-xl font-serif text-[#1A0F0A]">Social Media</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
              <input
                type="url"
                value={settings.instagram}
                onChange={(e) => handleChange('instagram', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
              <input
                type="url"
                value={settings.facebook}
                onChange={(e) => handleChange('facebook', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Twitter/X</label>
              <input
                type="url"
                value={settings.twitter}
                onChange={(e) => handleChange('twitter', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">YouTube</label>
              <input
                type="url"
                value={settings.youtube}
                onChange={(e) => handleChange('youtube', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}