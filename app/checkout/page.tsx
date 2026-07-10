'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/context/AuthContext';
import { 
  CreditCard, 
  Building2, 
  Wallet, 
  Check, 
  ArrowLeft,
  Copy,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  ArrowLeft as ArrowLeftIcon
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [copied, setCopied] = useState(false);
  const [focusedField, setFocusedField] = useState('fullName');
  
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    notes: '',
  });

  const [selectedPayment, setSelectedPayment] = useState('easypaisa');

  // Refs for focus management - properly typed
  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const notesRef = useRef<HTMLInputElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const placeOrderRef = useRef<HTMLButtonElement>(null);
  const paymentRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Helper function to focus inputs
  const focusField = (fieldName: string) => {
    const refs: Record<string, React.RefObject<HTMLInputElement | HTMLButtonElement> | null> = {
      fullName: fullNameRef,
      email: emailRef,
      phone: phoneRef,
      city: cityRef,
      address: addressRef,
      notes: notesRef,
      nextButton: nextButtonRef,
    };
    
    const ref = refs[fieldName];
    if (ref && 'current' in ref) {
      ref.current?.focus();
    }
  };

  useEffect(() => {
    if (!user) router.push('/login');
    if (items.length === 0) router.push('/cart');
  }, [user, items, router]);

  useEffect(() => {
    if (step === 1) {
      setTimeout(() => fullNameRef.current?.focus(), 100);
    }
  }, [step]);

  const subtotal = getTotalPrice();
  const shipping = subtotal > 5000 ? 0 : 500;
  const total = subtotal + shipping;

  const paymentMethods = [
    { id: 'easypaisa', name: 'EasyPaisa', icon: <Wallet className="text-green-600" size={24} />, details: ['Account: 0345-1234567', 'Title: RANA LEATHER\'S'] },
    { id: 'jazzcash', name: 'JazzCash', icon: <Wallet className="text-orange-500" size={24} />, details: ['Account: 0321-7654321', 'Title: RANA LEATHER\'S'] },
    { id: 'bank', name: 'Bank Transfer', icon: <Building2 className="text-blue-600" size={24} />, details: ['Bank: Meezan Bank', 'Account: 1234-5678901-2'] },
    { id: 'cod', name: 'Cash on Delivery', icon: <CreditCard className="text-purple-600" size={24} />, details: ['Pay at delivery', 'Nationwide'] },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStep1KeyDown = (e: React.KeyboardEvent, fieldName: string) => {
    const fields = ['fullName', 'email', 'phone', 'city', 'address', 'notes'];
    const currentIndex = fields.indexOf(fieldName);

    if (e.key === 'Enter') {
      e.preventDefault();
      if (currentIndex === fields.length - 1) {
        nextButtonRef.current?.focus();
      } else {
        const nextField = fields[currentIndex + 1];
        setFocusedField(nextField);
        const refs = [fullNameRef, emailRef, phoneRef, cityRef, addressRef, notesRef];
        refs[currentIndex + 1]?.current?.focus();
      }
    }

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      if (currentIndex < fields.length - 1) {
        const nextField = fields[currentIndex + 1];
        setFocusedField(nextField);
        const refs = [fullNameRef, emailRef, phoneRef, cityRef, addressRef, notesRef];
        refs[currentIndex + 1]?.current?.focus();
      }
    }

    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      if (currentIndex > 0) {
        const prevField = fields[currentIndex - 1];
        setFocusedField(prevField);
        const refs = [fullNameRef, emailRef, phoneRef, cityRef, addressRef, notesRef];
        refs[currentIndex - 1]?.current?.focus();
      }
    }
  };

  const handlePaymentKeyDown = (e: React.KeyboardEvent, index: number) => {
    const totalMethods = paymentMethods.length;

    if (e.key === 'Enter') {
      e.preventDefault();
      setSelectedPayment(paymentMethods[index].id);
      setTimeout(() => placeOrderRef.current?.focus(), 50);
    }

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (index + 1) % totalMethods;
      paymentRefs.current[nextIndex]?.focus();
    }

    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (index - 1 + totalMethods) % totalMethods;
      paymentRefs.current[prevIndex]?.focus();
    }
  };

  const validateStep1 = () => {
    if (!formData.fullName?.trim()) {
      alert('Please enter your full name');
      fullNameRef.current?.focus();
      return false;
    }
    if (!formData.email?.trim()) {
      alert('Please enter your email');
      emailRef.current?.focus();
      return false;
    }
    if (!formData.phone?.trim()) {
      alert('Please enter your phone number');
      phoneRef.current?.focus();
      return false;
    }
    if (!formData.address?.trim()) {
      alert('Please enter your address');
      addressRef.current?.focus();
      return false;
    }
    if (!formData.city?.trim()) {
      alert('Please enter your city');
      cityRef.current?.focus();
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => paymentRefs.current[0]?.focus(), 200);
    }
  };

  const handlePlaceOrder = async () => {
    if (!formData.fullName?.trim() || !formData.email?.trim() || !formData.phone?.trim() || !formData.address?.trim() || !formData.city?.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const orderItems = items.map(item => ({
        id: Number(item.id) || 0,
        name: item.name || 'Unknown Product',
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        size: item.size || null,
        color: item.color || null,
      }));

      if (orderItems.length === 0) {
        alert('Your cart is empty.');
        setLoading(false);
        return;
      }

      const subtotal = getTotalPrice();
      const shipping = subtotal > 5000 ? 0 : 500;
      const total = subtotal + shipping;

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: orderItems,
          subtotal: Number(subtotal),
          shipping: Number(shipping),
          total: Number(total),
          customer: {
            fullName: formData.fullName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            address: formData.address.trim(),
            city: formData.city.trim(),
            notes: formData.notes?.trim() || '',
          },
          paymentMethod: selectedPayment,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setOrderNumber(data.orderNumber || `ORD-${Date.now()}`);
        setOrderComplete(true);
        clearCart();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert(data.error || 'Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Order error:', error);
      alert('Something went wrong. Please try again.');
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
          <h1 className="text-3xl font-serif text-[#1A0F0A] mb-2">🎉 Order Placed!</h1>
          <p className="text-gray-500 mb-4">Thank you for your order!</p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Order Number</p>
            <p className="text-xl font-bold text-[#8B3A1A]">{orderNumber}</p>
          </div>
          <Link href="/products" className="bg-[#8B3A1A] text-white px-6 py-2 rounded-lg hover:bg-[#1A0F0A] transition inline-block">
            Continue Shopping
          </Link>
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
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-serif text-[#1A0F0A] mb-2">Checkout</h1>
          <p className="text-gray-500 mb-6">Complete your order in 2 simple steps</p>

          {/* Step Indicator */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 1 ? 'bg-[#8B3A1A] text-white' : 'bg-[#D4AF37] text-white'}`}>
                {step === 1 ? '1' : '✓'}
              </div>
              <span className={`text-sm font-medium ${step === 1 ? 'text-[#8B3A1A]' : 'text-gray-400'}`}>Details</span>
            </div>
            <div className={`flex-1 h-0.5 ${step >= 2 ? 'bg-[#D4AF37]' : 'bg-gray-200'}`} />
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 2 ? 'bg-[#8B3A1A] text-white' : 'bg-gray-200 text-gray-400'}`}>
                2
              </div>
              <span className={`text-sm font-medium ${step === 2 ? 'text-[#8B3A1A]' : 'text-gray-400'}`}>Payment</span>
            </div>
          </div>

          {/* Step 1: Details */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#D4AF37]/10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-serif text-[#1A0F0A]">Shipping Information</h2>
                <div className="text-xs text-gray-400 flex items-center gap-2">
                  <ArrowUp size={12} /> <ArrowDown size={12} /> <ArrowLeftIcon size={12} /> <ArrowRight size={12} /> navigate • Enter next
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'fullName', label: 'Full Name *', type: 'text', placeholder: 'Your full name', ref: fullNameRef },
                  { name: 'email', label: 'Email *', type: 'email', placeholder: 'your@email.com', ref: emailRef },
                  { name: 'phone', label: 'Phone *', type: 'tel', placeholder: '03XX-XXXXXXX', ref: phoneRef },
                  { name: 'city', label: 'City *', type: 'text', placeholder: 'Your city', ref: cityRef },
                ].map((field) => (
                  <div key={field.name} className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                    <input
                      ref={field.ref}
                      type={field.type}
                      name={field.name}
                      value={formData[field.name as keyof typeof formData] as string}
                      onChange={handleInputChange}
                      onKeyDown={(e) => handleStep1KeyDown(e, field.name)}
                      onFocus={() => setFocusedField(field.name)}
                      className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition ${
                        focusedField === field.name
                          ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/20 shadow-md'
                          : 'border-gray-200 hover:border-[#D4AF37]/50'
                      }`}
                      placeholder={field.placeholder}
                      required
                    />
                  </div>
                ))}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                  <input
                    ref={addressRef}
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    onKeyDown={(e) => handleStep1KeyDown(e, 'address')}
                    onFocus={() => setFocusedField('address')}
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition ${
                      focusedField === 'address'
                        ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/20 shadow-md'
                        : 'border-gray-200 hover:border-[#D4AF37]/50'
                    }`}
                    placeholder="House #, Street, Area"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order Notes</label>
                  <input
                    ref={notesRef}
                    type="text"
                    name="notes"
                    value={formData.notes || ''}
                    onChange={handleInputChange}
                    onKeyDown={(e) => handleStep1KeyDown(e, 'notes')}
                    onFocus={() => setFocusedField('notes')}
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition ${
                      focusedField === 'notes'
                        ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/20 shadow-md'
                        : 'border-gray-200 hover:border-[#D4AF37]/50'
                    }`}
                    placeholder="Special instructions..."
                  />
                </div>
              </div>
              <button
                ref={nextButtonRef}
                onClick={handleNextStep}
                className="mt-6 w-full md:w-auto bg-[#8B3A1A] hover:bg-[#1A0F0A] text-white px-8 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
              >
                Next Step <ChevronRight size={20} />
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#D4AF37]/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-serif text-[#1A0F0A]">Payment Method</h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="text-sm text-[#8B3A1A] hover:text-[#D4AF37] transition flex items-center gap-1"
                  >
                    <ChevronLeft size={16} /> Edit Details
                  </button>
                  <div className="text-xs text-gray-400 flex items-center gap-2">
                    <ArrowUp size={12} /> <ArrowDown size={12} /> <ArrowLeftIcon size={12} /> <ArrowRight size={12} /> navigate • Enter select
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map((method, index) => (
                  <button
                    key={method.id}
                    ref={(el) => { paymentRefs.current[index] = el; }}
                    onClick={() => setSelectedPayment(method.id)}
                    onKeyDown={(e) => handlePaymentKeyDown(e, index)}
                    className={`p-4 border-2 rounded-xl text-left transition-all duration-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none ${
                      selectedPayment === method.id
                        ? 'border-[#D4AF37] bg-[#D4AF37]/5 shadow-md'
                        : 'border-gray-200 hover:border-[#D4AF37]/50'
                    }`}
                    tabIndex={0}
                  >
                    <div className="flex items-center gap-2">
                      {method.icon}
                      <span className="font-medium text-[#1A0F0A] text-sm">{method.name}</span>
                      {selectedPayment === method.id && <Check size={16} className="text-[#D4AF37] ml-auto" />}
                    </div>
                  </button>
                ))}
              </div>

              {selectedPayment && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="font-semibold text-[#1A0F0A] mb-2 text-sm">
                    {paymentMethods.find(p => p.id === selectedPayment)?.name} Details
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    {paymentMethods.find(p => p.id === selectedPayment)?.details.map((detail, i) => (
                      <div key={i} className="flex items-center justify-between py-1 border-b border-gray-100 last:border-0">
                        <span>{detail}</span>
                        {detail.includes('Account') && (
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
                  <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-700">
                    <AlertCircle size={14} className="inline mr-1" />
                    Send confirmation to: info@ranaleathers.com
                  </div>
                </div>
              )}

              <button
                ref={placeOrderRef}
                onClick={handlePlaceOrder}
                disabled={loading}
                className="mt-6 w-full bg-gradient-to-r from-[#8B3A1A] to-[#1A0F0A] hover:from-[#6B2A10] hover:to-[#1A0F0A] text-white py-3 rounded-xl font-semibold transition disabled:opacity-50 shadow-lg focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
                tabIndex={0}
              >
                {loading ? 'Processing...' : 'Place Order ✓'}
              </button>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#D4AF37]/10 sticky top-24">
            <h2 className="text-xl font-serif text-[#1A0F0A] mb-4">Order Summary</h2>
            <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 pb-3 border-b">
                  <img src={item.image || '/images/products/jacket.jpg'} alt={item.name} className="w-12 h-12 object-cover rounded" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1A0F0A]">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-[#8B3A1A]">Rs. {(item.price * item.quantity).toLocaleString()}</p>
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
            <div className="mt-4 text-xs text-gray-400 text-center">
              {step === 1 ? 'Fill details then proceed' : 'Confirm and place your order'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
