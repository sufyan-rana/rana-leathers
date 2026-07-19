'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<'name' | 'email' | 'password'>('email');
  
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  
  const { login, register } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (isLogin) {
          emailInputRef.current?.focus();
          setFocusedField('email');
        } else {
          nameInputRef.current?.focus();
          setFocusedField('name');
        }
      }, 300);
    }
  }, [isOpen, isLogin]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
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
      // Redirect after successful login
      const redirectUrl = sessionStorage.getItem('redirectAfterLogin') || '/';
      sessionStorage.removeItem('redirectAfterLogin');
      window.location.href = redirectUrl;
    } else {
      setError(result.error || 'Something went wrong');
    }
  } catch (error) {
    setError('Something went wrong. Please try again.');
  } finally {
    setLoading(false);
  }
};

  const handleKeyDown = (e: React.KeyboardEvent, field: 'name' | 'email' | 'password') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      return;
    }

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      
      const fields: ('name' | 'email' | 'password')[] = isLogin 
        ? ['email', 'password'] 
        : ['name', 'email', 'password'];
      
      const currentIndex = fields.indexOf(field);
      
      if (currentIndex === -1) return;
      
      if (e.key === 'ArrowDown') {
        const nextIndex = (currentIndex + 1) % fields.length;
        const nextField = fields[nextIndex];
        setFocusedField(nextField);
        if (nextField === 'name') nameInputRef.current?.focus();
        else if (nextField === 'email') emailInputRef.current?.focus();
        else if (nextField === 'password') passwordInputRef.current?.focus();
      } else if (e.key === 'ArrowUp') {
        const prevIndex = (currentIndex - 1 + fields.length) % fields.length;
        const prevField = fields[prevIndex];
        setFocusedField(prevField);
        if (prevField === 'name') nameInputRef.current?.focus();
        else if (prevField === 'email') emailInputRef.current?.focus();
        else if (prevField === 'password') passwordInputRef.current?.focus();
      }
    }
  };

  const getFieldLabel = (field: 'name' | 'email' | 'password', label: string) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#1A0F0A]/80 via-[#8B3A1A]/60 to-[#D4AF37]/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-gradient-to-br from-[#F5EFE6] to-[#E8DCD0] w-full max-w-md p-8 rounded-2xl shadow-2xl animate-fadeInUp border border-[#D4AF37]/20">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-[#1A0F0A] transition-all duration-300 hover:rotate-90"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8 animate-slideDown">
          <div className="w-16 h-1 bg-gradient-to-r from-[#D4AF37] to-[#8B3A1A] mx-auto mb-4 rounded-full" />
          <h2 className="text-3xl font-serif font-light text-[#1A0F0A] mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-sm text-gray-500 font-light">
            {isLogin ? 'Sign in to access your account' : 'Join the RANA LEATHER\'S family'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
              {getFieldLabel('name', 'Full Name')}
              <div className="relative mt-1">
                <input
                  ref={nameInputRef}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, 'name')}
                  onFocus={() => setFocusedField('name')}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 rounded-xl focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-300 text-[#1A0F0A] placeholder:text-gray-400"
                  required
                  placeholder="Enter your full name"
                />
              </div>
            </div>
          )}

          <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            {getFieldLabel('email', 'Email Address')}
            <div className="relative mt-1">
              <input
                ref={emailInputRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'email')}
                onFocus={() => setFocusedField('email')}
                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 rounded-xl focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-300 text-[#1A0F0A] placeholder:text-gray-400"
                required
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            {getFieldLabel('password', 'Password')}
            <div className="relative mt-1">
              <input
                ref={passwordInputRef}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'password')}
                onFocus={() => setFocusedField('password')}
                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 rounded-xl focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-300 text-[#1A0F0A] placeholder:text-gray-400 pr-12"
                required
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#8B3A1A] transition-colors duration-300"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="animate-shake p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-500 text-sm text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#8B3A1A] to-[#1A0F0A] hover:from-[#6B2A10] hover:to-[#1A0F0A] text-white py-3 rounded-xl font-semibold transition-all duration-500 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-[#8B3A1A]/30 relative overflow-hidden group mt-2"
          >
            <span className="relative z-10">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Please wait...
                </span>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </span>
          </button>
        </form>

        <div className="text-center mt-6 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setFocusedField(isLogin ? 'name' : 'email');
            }}
            className="text-sm text-[#8B3A1A] hover:text-[#D4AF37] transition-colors duration-300 font-medium"
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">
            Use <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">↑</kbd> <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">↓</kbd> to navigate
          </p>
        </div>
      </div>
    </div>
  );
}