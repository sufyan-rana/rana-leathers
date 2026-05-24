"use client";

import { useState } from "react";
import Link from "next/link";  // 👈 Add this import
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "What materials do you use for your products?",
    answer: "We use only premium, ethically sourced genuine leather including full-grain buffalo leather, cowhide, and sheepskin. All our products are handcrafted with attention to detail."
  },
  {
    question: "How do I care for my leather product?",
    answer: "Keep your leather product away from direct sunlight and water. Use a leather conditioner every 3-6 months. For cleaning, wipe with a soft dry cloth. Avoid harsh chemicals."
  },
  {
    question: "Do you offer international shipping?",
    answer: "Yes, we ship worldwide! Shipping costs and delivery times vary by location. Please contact us for international shipping rates."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy on all unused products in original condition. Customers are responsible for return shipping costs unless the item is defective."
  },
  {
    question: "How long does delivery take?",
    answer: "Domestic delivery takes 2-3 business days. International delivery takes 7-14 business days depending on the destination."
  },
  {
    question: "Are your products handmade?",
    answer: "Yes! Since 2010, all RANA LEATHER'S products are handcrafted by master artisans in Sialkot, Pakistan."
  },
  {
    question: "Do you offer custom orders?",
    answer: "Yes, we accept custom orders for bulk purchases. Please contact our sales team with your requirements."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order ships, you will receive a tracking number via email. You can track your order on our website or the courier's portal."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container-custom py-12">
      <h1 className="section-title">Frequently Asked Questions</h1>
      <div className="section-underline"></div>
      <p className="text-center text-gray-600 mb-12">Find answers to common questions about our products and services</p>
      
      <div className="max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <div key={index} className="mb-4 border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center p-5 text-left bg-white hover:bg-gray-50 transition"
            >
              <span className="font-semibold text-[#2C1810]">{faq.question}</span>
              {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {openIndex === index && (
              <div className="p-5 bg-gray-50 border-t">
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="text-center mt-12 p-8 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-bold text-[#2C1810] mb-2">Still have questions?</h3>
        <p className="text-gray-600 mb-4">We're here to help you!</p>
        <Link href="/contact" className="btn-primary inline-block">Contact Us</Link>
      </div>
    </div>
  );
}
