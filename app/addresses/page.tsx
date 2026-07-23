'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  MapPin, 
  Plus, 
  Trash2, 
  Edit, 
  Check,
  Home,
  Briefcase,
  Star
} from 'lucide-react';

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'Home',
      label: 'Home Address',
      address: 'House #123, Street 4, Sialkot, Pakistan',
      isDefault: true,
      icon: <Home size={16} />,
    },
    {
      id: 2,
      type: 'Office',
      label: 'Office Address',
      address: 'Office #45, Business Center, Sialkot, Pakistan',
      isDefault: false,
      icon: <Briefcase size={16} />,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: 'Home',
    address: '',
    city: '',
    postalCode: '',
  });

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this address?')) {
      setAddresses(addresses.filter(a => a.id !== id));
    }
  };

  const handleSetDefault = (id: number) => {
    setAddresses(addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    })));
  };

  const handleAddAddress = () => {
    if (!newAddress.address) {
      alert('Please enter your address');
      return;
    }
    setAddresses([
      ...addresses,
      {
        id: Date.now(),
        type: newAddress.type,
        label: `${newAddress.type} Address`,
        address: newAddress.address,
        isDefault: false,
        icon: newAddress.type === 'Home' ? <Home size={16} /> : <Briefcase size={16} />,
      }
    ]);
    setShowAddForm(false);
    setNewAddress({ type: 'Home', address: '', city: '', postalCode: '' });
    alert('✅ Address added successfully!');
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
            <h1 className="text-xl font-semibold">Address Book</h1>
          </div>
        </div>
      </div>

      <div className="container-custom mt-4">
        {/* Add New Address Button */}
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full bg-white dark:bg-[#2C1810] rounded-2xl shadow-sm p-4 border border-gray-100 dark:border-[#3A2A24] flex items-center justify-center gap-2 hover:shadow-md transition"
        >
          <Plus size={20} className="text-[#8B3A1A] dark:text-[#D4AF37]" />
          <span className="font-medium text-[#8B3A1A] dark:text-[#D4AF37]">Add New Address</span>
        </button>

        {/* Add Address Form */}
        {showAddForm && (
          <div className="bg-white dark:bg-[#2C1810] rounded-2xl shadow-sm p-6 mt-4 border border-gray-100 dark:border-[#3A2A24]">
            <h3 className="font-semibold text-[#1A0F0A] dark:text-[#F5EFE6] mb-4">New Address</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address Type</label>
                <select
                  value={newAddress.type}
                  onChange={(e) => setNewAddress({...newAddress, type: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37] dark:bg-[#1A0F0A] dark:border-[#3A2A24] dark:text-[#F5EFE6]"
                >
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Address</label>
                <input
                  type="text"
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                  placeholder="House #, Street, Area"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37] dark:bg-[#1A0F0A] dark:border-[#3A2A24] dark:text-[#F5EFE6]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                <input
                  type="text"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37] dark:bg-[#1A0F0A] dark:border-[#3A2A24] dark:text-[#F5EFE6]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Postal Code</label>
                <input
                  type="text"
                  value={newAddress.postalCode}
                  onChange={(e) => setNewAddress({...newAddress, postalCode: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37] dark:bg-[#1A0F0A] dark:border-[#3A2A24] dark:text-[#F5EFE6]"
                />
              </div>
              <button
                onClick={handleAddAddress}
                className="w-full bg-[#8B3A1A] text-white py-2 rounded-lg hover:bg-[#1A0F0A] transition"
              >
                Add Address
              </button>
            </div>
          </div>
        )}

        {/* Address List */}
        {addresses.map((address) => (
          <div key={address.id} className="bg-white dark:bg-[#2C1810] rounded-2xl shadow-sm mt-4 border border-gray-100 dark:border-[#3A2A24] overflow-hidden">
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#8B3A1A]/10 dark:bg-[#D4AF37]/10 rounded-lg">
                    {address.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-[#1A0F0A] dark:text-[#F5EFE6]">{address.label}</h3>
                      {address.isDefault && (
                        <span className="text-xs bg-[#D4AF37] text-[#1A0F0A] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Star size={12} /> Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{address.address}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-[#1A0F0A] flex gap-3 justify-end border-t border-gray-100 dark:border-[#3A2A24]">
              {!address.isDefault && (
                <button
                  onClick={() => handleSetDefault(address.id)}
                  className="text-[#8B3A1A] dark:text-[#D4AF37] text-sm font-medium hover:opacity-80 transition"
                >
                  Set as Default
                </button>
              )}
              <button className="text-blue-500 text-sm font-medium hover:opacity-80 transition flex items-center gap-1">
                <Edit size={14} /> Edit
              </button>
              <button
                onClick={() => handleDelete(address.id)}
                className="text-red-500 text-sm font-medium hover:opacity-80 transition flex items-center gap-1"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}