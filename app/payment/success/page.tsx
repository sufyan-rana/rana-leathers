// app/payment/success/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      verifyPayment(sessionId);
    } else {
      router.push('/');
    }
  }, []);

  const verifyPayment = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/payment/verify?session_id=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setOrderNumber(data.orderNumber);
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mx-auto"></div>
        <p className="mt-4 text-gray-600">Verifying your payment...</p>
      </div>
    );
  }

  return (
    <div className="container-custom py-20 max-w-2xl">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={48} className="text-green-600" />
        </div>
        <h1 className="text-3xl font-serif text-[#1A0F0A] mb-2">Payment Successful! 🎉</h1>
        <p className="text-gray-500 mb-4">Your order has been confirmed.</p>
        {orderNumber && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Order Number</p>
            <p className="text-xl font-bold text-[#8B3A1A]">{orderNumber}</p>
          </div>
        )}
        <p className="text-gray-500 mb-6">We'll send you a confirmation email shortly.</p>
        <Link href="/products" className="bg-[#8B3A1A] text-white px-6 py-2 rounded-lg hover:bg-[#1A0F0A] transition inline-block">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}