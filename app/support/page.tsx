'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Phone, 
  ChevronDown,
  ChevronUp,
  FileText,
  Clock,
  Users,
  Shield,
  AlertCircle,
  Send
} from 'lucide-react';

export default function SupportPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  const faqs = [
    {
      question: 'How do I track my order?',
      answer: 'You can track your order by visiting the "My Orders" section in your account settings. Click on the order to see real-time tracking updates.',
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy on all unused products in original condition. Contact our support team to initiate a return.',
    },
    {
      question: 'How long does shipping take?',
      answer: 'Domestic shipping takes 2-3 business days. International shipping takes 7-14 business days depending on the destination.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept EasyPaisa, JazzCash, Bank Transfer, and Cash on Delivery (COD) for domestic orders.',
    },
    {
      question: 'How do I change my password?',
      answer: 'Go to Settings → Change Password. Enter your current password and new password, then click Update Password.',
    },
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
            <h1 className="text-xl font-semibold">Help & Support</h1>
          </div>
        </div>
      </div>

      <div className="container-custom mt-4">
        {/* Quick Support Options */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-[#2C1810] rounded-2xl shadow-sm p-4 text-center border border-gray-100 dark:border-[#3A2A24] hover:shadow-md transition cursor-pointer">
            <MessageCircle size={24} className="text-[#8B3A1A] dark:text-[#D4AF37] mx-auto" />
            <p className="text-sm font-medium text-[#1A0F0A] dark:text-[#F5EFE6] mt-2">Live Chat</p>
          </div>
          <div className="bg-white dark:bg-[#2C1810] rounded-2xl shadow-sm p-4 text-center border border-gray-100 dark:border-[#3A2A24] hover:shadow-md transition cursor-pointer">
            <Mail size={24} className="text-[#8B3A1A] dark:text-[#D4AF37] mx-auto" />
            <p className="text-sm font-medium text-[#1A0F0A] dark:text-[#F5EFE6] mt-2">Email Support</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white dark:bg-[#2C1810] rounded-2xl shadow-sm p-4 mt-4 border border-gray-100 dark:border-[#3A2A24]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#8B3A1A]/10 dark:bg-[#D4AF37]/10 rounded-lg">
              <Phone size={20} className="text-[#8B3A1A] dark:text-[#D4AF37]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#1A0F0A] dark:text-[#F5EFE6]">Call us</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">+92 300 1234567</p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-[#1A0F0A] dark:text-[#F5EFE6] mb-3 flex items-center gap-2">
            <HelpCircle size={20} className="text-[#8B3A1A] dark:text-[#D4AF37]" />
            Frequently Asked Questions
          </h2>

          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-[#2C1810] rounded-2xl shadow-sm mb-3 border border-gray-100 dark:border-[#3A2A24] overflow-hidden"
            >
              <button
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <span className="font-medium text-[#1A0F0A] dark:text-[#F5EFE6]">{faq.question}</span>
                {openFAQ === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {openFAQ === index && (
                <div className="p-4 pt-0 border-t border-gray-100 dark:border-[#3A2A24]">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="bg-white dark:bg-[#2C1810] rounded-2xl shadow-sm p-6 mt-4 border border-gray-100 dark:border-[#3A2A24]">
          <h3 className="font-semibold text-[#1A0F0A] dark:text-[#F5EFE6] mb-4 flex items-center gap-2">
            <Send size={18} className="text-[#8B3A1A] dark:text-[#D4AF37]" />
            Send us a message
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37] dark:bg-[#1A0F0A] dark:border-[#3A2A24] dark:text-[#F5EFE6]"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37] dark:bg-[#1A0F0A] dark:border-[#3A2A24] dark:text-[#F5EFE6]"
            />
            <textarea
              placeholder="Your Message"
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37] dark:bg-[#1A0F0A] dark:border-[#3A2A24] dark:text-[#F5EFE6]"
            />
            <button className="w-full bg-gradient-to-r from-[#8B3A1A] to-[#1A0F0A] text-white py-3 rounded-xl font-semibold transition hover:opacity-90">
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}