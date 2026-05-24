import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="container-custom py-12">
      <h1 className="section-title">Terms & Conditions</h1>
      <div className="section-underline"></div>
      <p className="text-center text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
      
      <div className="max-w-4xl mx-auto space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-[#2C1810] mb-3">1. Terms of Use</h2>
          <p className="text-gray-600 leading-relaxed">By accessing this website, you agree to be bound by these terms and conditions. If you disagree with any part, please do not use our website.</p>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold text-[#2C1810] mb-3">2. Privacy Policy</h2>
          <p className="text-gray-600 leading-relaxed">We respect your privacy and protect your personal information. Your data is only used for order processing and never shared with third parties.</p>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold text-[#2C1810] mb-3">3. Shipping Policy</h2>
          <p className="text-gray-600 leading-relaxed">Orders are processed within 1-2 business days. Domestic shipping takes 2-3 business days. International shipping takes 7-14 business days.</p>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold text-[#2C1810] mb-3">4. Return & Refund Policy</h2>
          <p className="text-gray-600 leading-relaxed">We offer a 30-day return policy. Products must be unused and in original packaging. Refunds are processed within 5-7 business days after inspection.</p>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold text-[#2C1810] mb-3">5. Payment Terms</h2>
          <p className="text-gray-600 leading-relaxed">We accept Cash on Delivery (COD), bank transfers, and credit/debit cards. All payments are secure and encrypted.</p>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold text-[#2C1810] mb-3">6. Warranty Information</h2>
          <p className="text-gray-600 leading-relaxed">All products come with a 6-month warranty against manufacturing defects. Normal wear and tear is not covered.</p>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold text-[#2C1810] mb-3">7. Contact Information</h2>
          <p className="text-gray-600 leading-relaxed">For any questions regarding these terms, contact us at info@ranaleathers.com or +92 300 1234567.</p>
        </section>
      </div>
      
      <div className="text-center mt-12 pt-8 border-t">
        <Link href="/" className="text-[#8B4513] hover:text-[#C8A951] transition">? Back to Home</Link>
      </div>
    </div>
  );
}
