'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Check,
  Edit,
  Save,
  X
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '0300-1234567',
    address: 'House #123, Street 4, Sialkot, Pakistan',
  });

  const handleSave = () => {
    setIsEditing(false);
    alert('✅ Profile updated successfully!');
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
            <h1 className="text-xl font-semibold">My Profile</h1>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="container-custom mt-4">
        <div className="bg-white dark:bg-[#2C1810] rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-[#3A2A24]">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#8B3A1A] to-[#D4AF37] flex items-center justify-center text-3xl font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <button className="absolute -bottom-1 -right-1 bg-[#D4AF37] rounded-full p-2 text-white hover:bg-[#B8943A] transition">
                <Camera size={16} />
              </button>
            </div>
            <h2 className="text-xl font-semibold mt-4 text-[#1A0F0A] dark:text-[#F5EFE6]">
              {user?.name || 'User'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
            <span className="text-xs bg-[#D4AF37] text-[#1A0F0A] px-3 py-1 rounded-full mt-2">
              {user?.role || 'User'}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="container-custom mt-4">
        <div className="bg-white dark:bg-[#2C1810] rounded-2xl shadow-sm border border-gray-100 dark:border-[#3A2A24] overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-[#3A2A24] flex justify-between items-center">
            <h3 className="font-semibold text-[#1A0F0A] dark:text-[#F5EFE6]">Personal Information</h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-[#8B3A1A] dark:text-[#D4AF37] hover:opacity-80 transition text-sm flex items-center gap-1"
            >
              {isEditing ? <X size={16} /> : <Edit size={16} />}
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          <div className="p-4 space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#1A0F0A] rounded-xl">
              <User size={20} className="text-[#8B3A1A] dark:text-[#D4AF37]" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">Full Name</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-transparent border-b border-[#D4AF37] focus:outline-none text-[#1A0F0A] dark:text-[#F5EFE6]"
                  />
                ) : (
                  <p className="font-medium text-[#1A0F0A] dark:text-[#F5EFE6]">{formData.name}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#1A0F0A] rounded-xl">
              <Mail size={20} className="text-[#8B3A1A] dark:text-[#D4AF37]" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">Email Address</p>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-transparent border-b border-[#D4AF37] focus:outline-none text-[#1A0F0A] dark:text-[#F5EFE6]"
                  />
                ) : (
                  <p className="font-medium text-[#1A0F0A] dark:text-[#F5EFE6]">{formData.email}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#1A0F0A] rounded-xl">
              <Phone size={20} className="text-[#8B3A1A] dark:text-[#D4AF37]" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">Phone Number</p>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-transparent border-b border-[#D4AF37] focus:outline-none text-[#1A0F0A] dark:text-[#F5EFE6]"
                  />
                ) : (
                  <p className="font-medium text-[#1A0F0A] dark:text-[#F5EFE6]">{formData.phone}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#1A0F0A] rounded-xl">
              <MapPin size={20} className="text-[#8B3A1A] dark:text-[#D4AF37]" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">Address</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full bg-transparent border-b border-[#D4AF37] focus:outline-none text-[#1A0F0A] dark:text-[#F5EFE6]"
                  />
                ) : (
                  <p className="font-medium text-[#1A0F0A] dark:text-[#F5EFE6]">{formData.address}</p>
                )}
              </div>
            </div>

            {isEditing && (
              <button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-[#8B3A1A] to-[#1A0F0A] text-white py-3 rounded-xl font-semibold transition hover:opacity-90 flex items-center justify-center gap-2"
              >
                <Save size={18} /> Save Changes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}