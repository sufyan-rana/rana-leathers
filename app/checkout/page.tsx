'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/context/AuthContext';
import { 
  CreditCard, 
  Building2, 
  Wallet, 
  Truck, 
  Check, 
  ArrowLeft,
  Copy,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  details: string[];
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'easypaisa',
    notes: '',
  });

  const [selectedPayment, setSelectedPayment] = useState('easypaisa');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [user, items, router]);

  const subtotal = getTotalPrice();
  const shipping = subtotal > 5000 ? 0 : 500;
  const total = subtotal + shipping;

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'easypaisa',
      name: 'EasyPaisa',
      icon: <Wallet className="text-green-600" size={24} />,
      description: 'Pay using EasyPaisa mobile account',
      details: [
        'Account Number: 0345-1234567',
        'Account Title: RANA LEATHER\'S',
        'Reference: Order # + Your Name',
      ]
    },
    {
      id: 'jazzcash',
      name: 'JazzCash',
      icon: <Wallet className="text-orange-500" size={24} />,
      description: 'Pay using JazzCash mobile account',
      details: [
        'Account Number: 0321-7654321',
        'Account Title: RANA LEATHER\'S',
        'Reference: Order # + Your Name',
      ]
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: <Building2 className="text-blue-600" size={24} />,
      description: 'Direct bank transfer to our account',
      details: [
        'Bank: Meezan Bank',
        'Account Title: RANA LEATHER\'S',
        'Account Number: 1234-5678901-2',
        'Branch: Sialkot, Pakistan',
        'IBAN: PK99MEZN0012345678901234',
      ]
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: <CreditCard className="text-purple-600" size={24} />,
      description: 'Pay when you receive your order',
      details: [
        'Pay at delivery with cash',
        'Available nationwide',
        'No extra charges',
      ]
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 const handlePlaceOrder = async () => {
  if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
    alert('Please fill in all required fields');
    return;
  }

  setLoading(true);
  try {
    // Map cart items to order items format
    const orderItems = items.map(item => ({
      id: item.id,        // Use item.id directly
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      size: item.size || null,
      color: item.color || null,
    }));

    console.log('Sending order:', { items: orderItems, customer: formData }); // Debug log

    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: orderItems,
        subtotal,
        shipping,
        total,
        customer: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
        },
        paymentMethod: selectedPayment,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setOrderNumber(data.orderNumber);
      setOrderComplete(true);
      clearCart();
    } else {
      alert(data.error || 'Failed to place order. Please try again.');
      console.error('Order error:', data);
    }
  } catch (error) {
    alert('Something went wrong. Please try again.');
    console.error('Order error:', error);
  } finally {
    setLoading(false);
  }
};
  if (orderComplete) {
    return (
      <div className="container-custom py-12 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-serif text-[#1A0F0A] mb-2">Order Placed! 🎉</h1>
          <p className="text-gray-500 mb-4">Thank you for your order!</p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Order Number</p>
            <p className="text-xl font-bold text-[#8B3A1A]">{orderNumber}</p>
          </div>
          <div className="space-y-2 text-left mb-6">
            <p className="text-sm text-gray-600">
              <strong>Payment Method:</strong> {paymentMethods.find(p => p.id === selectedPayment)?.name}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Total Amount:</strong> Rs. {total.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-4">
              You will receive a confirmation email shortly. For payment instructions, please check your email or contact us.
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <Link
              href="/products"
              className="bg-[#8B3A1A] text-white px-6 py-2 rounded-lg hover:bg-[#1A0F0A] transition"
            >
              Continue Shopping
            </Link>
            <Link
              href={`/orders/${orderNumber}`}
              className="border border-[#8B3A1A] text-[#8B3A1A] px-6 py-2 rounded-lg hover:bg-[#8B3A1A] hover:text-white transition"
            >
              View Order
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <Link href="/cart" className="inline-flex items-center gap-2 text-[#8B3A1A] hover:text-[#D4AF37] transition mb-6">
        <ArrowLeft size={20} /> Back to Cart
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-serif text-[#1A0F0A] mb-2">Checkout</h1>
          <p className="text-gray-500 mb-6">Fill in your details to complete your order</p>

          {/* Step Indicator */}
          <div className="flex items-center gap-4 mb-8">
            <div className={`flex-1 h-1 rounded-full ${step >= 1 ? 'bg-[#8B3A1A]' : 'bg-gray-200'}`} />
            <span className="text-sm font-medium text-[#8B3A1A]">Step 1: Details</span>
            <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-[#8B3A1A]' : 'bg-gray-200'}`} />
            <span className={`text-sm font-medium ${step >= 2 ? 'text-[#8B3A1A]' : 'text-gray-400'}`}>Step 2: Payment</span>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#D4AF37]/10">
            <h2 className="text-xl font-serif text-[#1A0F0A] mb-4">Shipping Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="03XX-XXXXXXX"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37]"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="House #, Street, Area"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Notes</label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Special instructions..."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#D4AF37]/10 mt-6">
            <h2 className="text-xl font-serif text-[#1A0F0A] mb-4">Payment Method</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`p-4 border-2 rounded-xl text-left transition-all duration-300 ${
                    selectedPayment === method.id
                      ? 'border-[#D4AF37] bg-[#D4AF37]/5 shadow-md'
                      : 'border-gray-200 hover:border-[#D4AF37]/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {method.icon}
                    <div>
                      <p className="font-semibold text-[#1A0F0A]">{method.name}</p>
                      <p className="text-xs text-gray-500">{method.description}</p>
                    </div>
                    {selectedPayment === method.id && (
                      <Check size={16} className="text-[#D4AF37] ml-auto" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Payment Details */}
            {selectedPayment && (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="font-semibold text-[#1A0F0A] mb-2">
                  {paymentMethods.find(p => p.id === selectedPayment)?.name} Details
                </h3>
                <div className="space-y-1 text-sm text-gray-600">
                  {paymentMethods.find(p => p.id === selectedPayment)?.details.map((detail, i) => (
                    <div key={i} className="flex items-center justify-between py-1 border-b border-gray-100 last:border-0">
                      <span>{detail}</span>
                      {detail.includes('Number') && (
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(detail.split(': ')[1]);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                          className="text-[#8B3A1A] hover:text-[#D4AF37] transition text-xs flex items-center gap-1"
                        >
                          <Copy size={14} />
                          {copied ? 'Copied!' : 'Copy'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-700">
                  <AlertCircle size={14} className="inline mr-1" />
                  Please send payment confirmation to info@ranaleathers.com
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#D4AF37]/10 sticky top-24">
            <h2 className="text-xl font-serif text-[#1A0F0A] mb-4">Order Summary</h2>
            
            <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 pb-3 border-b">
                  <img
                    src={item.image || '/images/products/jacket.jpg'}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1A0F0A]">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-[#8B3A1A]">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span>{shipping === 0 ? 'Free' : `Rs. ${shipping}`}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total</span>
                <span className="text-[#8B3A1A]">Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-[#8B3A1A] to-[#1A0F0A] hover:from-[#6B2A10] hover:to-[#1A0F0A] text-white py-3 rounded-xl font-semibold transition-all duration-500 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Place Order'
              )}
            </button>

            <p className="text-xs text-gray-400 text-center mt-4">
              By placing an order, you agree to our Terms & Conditions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
