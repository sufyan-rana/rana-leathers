'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Globe, 
  Check, 
  ChevronRight,
  Languages
} from 'lucide-react';

export default function LanguagePage() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const languages = [
    { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
    { code: 'ur', name: 'Urdu', native: 'اردو', flag: '🇵🇰' },
    { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪' },
    { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1A0F0A] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#8B3A1A] to-[#1A0F0A] text-white sticky top-0 z-10">
        <div className="container-custom py-4">
          <div className="flex items-center gap-4">
            <Link href="/settings" className="hover:opacity-80 transition">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-xl font-semibold">Language</h1>
          </div>
        </div>
      </div>

      <div className="container-custom mt-4">
        <div className="bg-white dark:bg-[#2C1810] rounded-2xl shadow-sm border border-gray-100 dark:border-[#3A2A24] overflow-hidden">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLanguage(lang.code)}
              className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-[#1A0F0A] transition border-b border-gray-100 dark:border-[#3A2A24] last:border-0 ${
                selectedLanguage === lang.code ? 'bg-[#D4AF37]/5' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{lang.flag}</span>
                <div className="text-left">
                  <p className="font-medium text-[#1A0F0A] dark:text-[#F5EFE6]">{lang.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{lang.native}</p>
                </div>
              </div>
              {selectedLanguage === lang.code && (
                <Check size={20} className="text-[#D4AF37]" />
              )}
            </button>
          ))}
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 mt-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Globe size={20} className="text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300">More languages coming soon</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                We're working on adding more languages to serve you better.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}