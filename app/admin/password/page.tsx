'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';

export default function ChangePasswordPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [focusedField, setFocusedField] = useState<'current' | 'new' | 'confirm'>('current');

  const currentRef = useRef<HTMLInputElement>(null);
  const newRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => {
      currentRef.current?.focus();
    }, 100);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: '❌ Passwords do not match' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: '❌ Password must be at least 6 characters' });
      return;
    }

    setLoading(true);

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
        setMessage({ type: 'success', text: '✅ Password updated successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => router.push('/admin'), 2000);
      } else {
        setMessage({ type: 'error', text: data.error || '❌ Failed to update password' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  // Fixed keyboard navigation - works with all fields
  const handleKeyDown = (e: React.KeyboardEvent, field: 'current' | 'new' | 'confirm') => {
    // Prevent Enter key from submitting
    if (e.key === 'Enter') {
      e.preventDefault();
      return;
    }

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      
      const fields: ('current' | 'new' | 'confirm')[] = ['current', 'new', 'confirm'];
      const currentIndex = fields.indexOf(field);
      
      if (currentIndex === -1) return;
      
      if (e.key === 'ArrowDown') {
        const nextIndex = (currentIndex + 1) % fields.length;
        const nextField = fields[nextIndex];
        setFocusedField(nextField);
        moveFocus(nextField);
      } else if (e.key === 'ArrowUp') {
        const prevIndex = (currentIndex - 1 + fields.length) % fields.length;
        const prevField = fields[prevIndex];
        setFocusedField(prevField);
        moveFocus(prevField);
      }
    }
  };

  const moveFocus = (field: 'current' | 'new' | 'confirm') => {
    if (field === 'current') {
      currentRef.current?.focus();
    } else if (field === 'new') {
      newRef.current?.focus();
    } else if (field === 'confirm') {
      confirmRef.current?.focus();
    }
  };

  const getFieldLabel = (field: 'current' | 'new' | 'confirm', label: string) => {
    const isFocused = focusedField === field;
    return (
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-[#1A0F0A]">
          {label}
        </label>
        {isFocused && (
          <span className="text-xs text-[#D4AF37] flex items-center gap-1">
            <ArrowUp size={12} />
            <ArrowDown size={12} />
            <span className="text-gray-400 ml-1">navigate</span>
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="animate-fadeInUp">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-[#1A0F0A] mb-2">Change Password</h1>
        <p className="text-gray-600">Update your admin account password</p>
      </div>

      <div className="max-w-md bg-gradient-to-br from-white to-[#F5EFE6] rounded-2xl shadow-xl p-8 border border-[#D4AF37]/10">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            {getFieldLabel('current', 'Current Password')}
            <div className="relative mt-1">
              <input
                ref={currentRef}
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'current')}
                onFocus={() => setFocusedField('current')}
                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 rounded-xl focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-300 text-[#1A0F0A] placeholder:text-gray-400 pr-12"
                required
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#8B3A1A] transition-colors"
              >
                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div> 

          <div>
            {getFieldLabel('new', 'New Password')}
            <div className="relative mt-1">
              <input
                ref={newRef}
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'new')}
                onFocus={() => setFocusedField('new')}
                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 rounded-xl focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-300 text-[#1A0F0A] placeholder:text-gray-400 pr-12"
                required
                placeholder="Enter new password (min 6 chars)"
                minLength={6} 
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#8B3A1A] transition-colors"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            {getFieldLabel('confirm', 'Confirm New Password')}
            <div className="relative mt-1">
              <input
                ref={confirmRef}
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'confirm')}
                onFocus={() => setFocusedField('confirm')}
                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 rounded-xl focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-300 text-[#1A0F0A] placeholder:text-gray-400 pr-12"
                required
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#8B3A1A] transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-xl ${
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#8B3A1A] to-[#1A0F0A] hover:from-[#6B2A10] hover:to-[#1A0F0A] text-white py-3 rounded-xl font-semibold transition-all duration-500 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </span>
            ) : (
              'Update Password'
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">
            Use <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">↑</kbd> <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">↓</kbd> to navigate fields
          </p>
        </div>
      </div>
    </div>
  );
}