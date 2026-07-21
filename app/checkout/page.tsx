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
  Check, 
  ArrowLeft,
  Copy,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Smartphone,
  Landmark,
  ExternalLink,
  Clock
} from 'lucide-react';

// Countries
const allCountries = [
  'Pakistan', 'India', 'China', 'Japan', 'South Korea', 
  'Indonesia', 'Malaysia', 'Singapore', 'Thailand', 'Vietnam',
  'Philippines', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Afghanistan',
  'UAE', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Oman', 'Bahrain',
  'United Kingdom', 'Germany', 'France', 'Italy', 'Spain',
  'Netherlands', 'Switzerland', 'Sweden', 'Norway', 'Denmark'
].sort();

const pakistaniCities = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
  'Multan', 'Hyderabad', 'Gujranwala', 'Peshawar', 'Quetta',
  'Sialkot', 'Sargodha', 'Bahawalpur', 'Sukkur', 'Larkana'
];

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    country: 'Pakistan',
    postalCode: '',
    notes: '',
  });

  const [selectedPayment, setSelectedPayment] = useState('easypaisa');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (items.length === 0) {
      router.push('/cart');
      return;
    }
  }, [user, items, router]);

  const subtotal = getTotalPrice();
  const shipping = subtotal > 5000 ? 0 : 500;
  const total = subtotal + shipping;

  // Payment Methods with direct links
  const paymentMethods = [
    {
      id: 'easypaisa',
      name: 'EasyPaisa',
      icon: <Smartphone className="text-green-600" size={24} />,
      description: 'Pay with EasyPaisa mobile account',
      details: [
        { label: 'Account Number', value: '0345-1234567' },
        { label: 'Account Title', value: 'RANA LEATHER\'S' },
        { label: 'Reference', value: 'Order # + Your Name' },
      ],
      link: 'https://easypaisa.com.pk/',
      linkText: 'Pay with EasyPaisa →',
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      id: 'jazzcash',
      name: 'JazzCash',
      icon: <Smartphone className="text-orange-500" size={24} />,
      description: 'Pay with JazzCash mobile account',
      details: [
        { label: 'Account Number', value: '0321-7654321' },
        { label: 'Account Title', value: 'RANA LEATHER\'S' },
        { label: 'Reference', value: 'Order # + Your Name' },
      ],
      link: 'https://jazzcash.com.pk/',
      linkText: 'Pay with JazzCash →',
      color: 'bg-orange-500 hover:bg-orange-600',
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: <Landmark className="text-blue-600" size={24} />,
      description: 'Direct bank transfer',
      details: [
        { label: 'Bank', value: 'Meezan Bank' },
        { label: 'Account Title', value: 'RANA LEATHER\'S' },
        { label: 'Account Number', value: '1234-5678901-2' },
        { label: 'Branch Code', value: '0123' },
        { label: 'IBAN', value: 'PK99MEZN0012345678901234' },
      ],
      link: '#',
      linkText: 'Copy Account Details',
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: <Wallet className="text-yellow-600" size={24} />,
      description: 'Pay when you receive',
      details: [
        { label: 'Payment', value: 'Cash on Delivery' },
        { label: 'Availability', value: 'Nationwide' },
        { label: 'Extra Charges', value: 'None' },
      ],
      link: '#',
      linkText: 'Confirm COD Order',
      color: 'bg-yellow-600 hover:bg-yellow-700',
    },
    {
      id: 'card',
      name: 'Credit / Debit Card',
      icon: <CreditCard className="text-purple-400" size={24} />,
      description: 'Coming soon',
      details: [],
      link: '#',
      linkText: 'Coming Soon',
      color: 'bg-gray-400 cursor-not-allowed',
      comingSoon: true,
    },
  ];

  const validatePhone = (phone: string) => {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    const phoneRegex = /^03\d{9}$/;
    return phoneRegex.test(cleaned);
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName?.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email?.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone?.trim()) newErrors.phone = 'Phone number is required';
    else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 11-digit Pakistani phone number (03XX-XXXXXXX)';
    }
    if (!formData.address?.trim()) newErrors.address = 'Address is required';
    if (!formData.city?.trim()) newErrors.city = 'City is required';
    if (!formData.country?.trim()) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setCopiedField(null);
    }, 2000);
  };

  const handlePayment = async () => {
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
            country: formData.country.trim(),
            postalCode: formData.postalCode.trim(),
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
          <div className="space-y-2 text-left mb-6">
            <p className="text-sm text-gray-600">
              <strong>Payment Method:</strong> {paymentMethods.find(p => p.id === selectedPayment)?.name}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Total Amount:</strong> Rs. {total.toLocaleString()}
            </p>
            {selectedPayment !== 'cod' && selectedPayment !== 'card' && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-700">
                  Please send payment confirmation to: <strong>info@ranaleathers.com</strong>
                </p>
              </div>
            )}
          </div>
          <div className="flex gap-4 justify-center">
            <Link href="/products" className="bg-[#8B3A1A] text-white px-6 py-2 rounded-lg hover:bg-[#1A0F0A] transition">
              Continue Shopping
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
              <h2 className="text-xl font-serif text-[#1A0F0A] mb-4">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37] ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37] ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="03XX-XXXXXXX"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37] ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37] ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    {allCountries.map((country) => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                  {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37] ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select a city</option>
                    {pakistaniCities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="e.g., 54000"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37]"
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
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37] ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order Notes</label>
                  <input
                    type="text"
                    name="notes"
                    value={formData.notes || ''}
                    onChange={handleInputChange}
                    placeholder="Special instructions..."
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
              <button
                onClick={handleNextStep}
                className="mt-6 w-full bg-[#8B3A1A] hover:bg-[#1A0F0A] text-white px-8 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
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
                <button
                  onClick={() => setStep(1)}
                  className="text-sm text-[#8B3A1A] hover:text-[#D4AF37] transition flex items-center gap-1"
                >
                  <ChevronLeft size={16} /> Edit Details
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => {
                      if (method.comingSoon) {
                        alert('Card payments coming soon!');
                        return;
                      }
                      setSelectedPayment(method.id);
                    }}
                    disabled={method.comingSoon}
                    className={`p-4 border-2 rounded-xl text-left transition-all duration-300 ${
                      selectedPayment === method.id && !method.comingSoon
                        ? 'border-[#D4AF37] bg-[#D4AF37]/5 shadow-md'
                        : method.comingSoon
                        ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                        : 'border-gray-200 hover:border-[#D4AF37]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {method.icon}
                      <div>
                        <p className={`font-medium text-sm ${method.comingSoon ? 'text-gray-400' : 'text-[#1A0F0A]'}`}>
                          {method.name}
                          {method.comingSoon && (
                            <span className="ml-2 text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">Soon</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">{method.description}</p>
                      </div>
                      {selectedPayment === method.id && !method.comingSoon && <Check size={16} className="text-[#D4AF37] ml-auto" />}
                    </div>
                  </button>
                ))}
              </div>

              {/* Payment Details */}
              {selectedPayment && !paymentMethods.find(p => p.id === selectedPayment)?.comingSoon && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="font-semibold text-[#1A0F0A] mb-2 text-sm">
                    {paymentMethods.find(p => p.id === selectedPayment)?.name} Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    {paymentMethods.find(p => p.id === selectedPayment)?.details.map((detail, i) => (
                      <div key={i} className="flex items-center justify-between py-1 border-b border-gray-100 last:border-0">
                        <span className="text-gray-600">{detail.label}:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-[#1A0F0A]">{detail.value}</span>
                          {detail.label !== 'Payment' && detail.label !== 'Availability' && detail.label !== 'Extra Charges' && (
                            <button
                              onClick={() => handleCopy(detail.value, detail.label)}
                              className="text-[#8B3A1A] hover:text-[#D4AF37] transition text-xs flex items-center gap-1"
                            >
                              <Copy size={14} />
                              {copiedField === detail.label ? 'Copied!' : 'Copy'}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Payment Action Buttons */}
                  <div className="mt-4">
                    {selectedPayment === 'easypaisa' && (
                      <a
                        href="https://easypaisa.com.pk/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition w-full justify-center"
                      >
                        Pay with EasyPaisa <ExternalLink size={16} />
                      </a>
                    )}
                    {selectedPayment === 'jazzcash' && (
                      <a
                        href="https://jazzcash.com.pk/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition w-full justify-center"
                      >
                        Pay with JazzCash <ExternalLink size={16} />
                      </a>
                    )}
                    {selectedPayment === 'bank' && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-700">
                        <AlertCircle size={14} className="inline mr-1" />
                        After payment, send confirmation to: <strong>info@ranaleathers.com</strong>
                      </div>
                    )}
                    {selectedPayment === 'cod' && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700 flex items-center gap-2">
                        <Clock size={14} />
                        Pay cash when your order arrives
                      </div>
                    )}
                  </div>

                  {/* Place Order Button */}
                  <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="mt-4 w-full bg-gradient-to-r from-[#8B3A1A] to-[#1A0F0A] hover:from-[#6B2A10] hover:to-[#1A0F0A] text-white py-3 rounded-xl font-semibold transition disabled:opacity-50 shadow-lg"
                  >
                    {loading ? 'Processing...' : `Place Order - Rs. ${total.toLocaleString()}`}
                  </button>
                </div>
              )}
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
          </div>
        </div>
      </div>
    </div>
  );
}