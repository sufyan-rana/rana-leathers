'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let result;
    if (isLogin) {
      result = await login(email, password);
    } else {
      if (!name) {
        setError('Name is required');
        setLoading(false);
        return;
      }
      result = await register(name, email, password);
    }

    if (result.success) {
      onClose();
      if (onSuccess) onSuccess();
    } else {
      setError(result.error || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-[#F5EFE6] w-full max-w-md p-8 rounded-lg shadow-2xl mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-[#1A0F0A] transition"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-serif text-[#1A0F0A] mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <div className="w-12 h-px bg-[#D4AF37] mx-auto" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm text-[#1A0F0A] mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition bg-white rounded"
                required
                placeholder="Enter your name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-[#1A0F0A] mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition bg-white rounded"
              required
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm text-[#1A0F0A] mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition bg-white rounded"
              required
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8B3A1A] hover:bg-[#1A0F0A] text-white py-2 transition disabled:opacity-50 rounded"
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-sm text-[#8B3A1A] hover:text-[#D4AF37] transition"
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
