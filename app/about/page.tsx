"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AboutPage() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-up').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl md:text-4xl font-serif font-light text-[#1A0F0A] text-center mb-4">About RANA LEATHER'S</h1>
      <div className="w-12 h-px bg-[#D4AF37] mx-auto mb-8"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="fade-up">
          <p className="text-gray-700 mb-4 leading-relaxed">
            Since 2010, RANA LEATHER'S has been at the forefront of leather craftsmanship in Sialkot, Pakistan. 
            Our master artisans combine traditional techniques with modern designs to create pieces that stand the test of time.
          </p>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Every product is crafted from premium, ethically sourced leather and undergoes rigorous quality checks 
            before reaching your hands.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We take pride in our heritage and continue to serve customers who appreciate the beauty of handcrafted leather goods.
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-[#E8DCD0] to-[#D4C5B0] h-96 flex items-center justify-center fade-up overflow-hidden rounded-lg shadow-md">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop" 
            alt="RANA LEATHER'S Artisan Workshop"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>
      </div>
      
      <div className="mt-16">
        <h2 className="text-2xl font-serif font-bold text-center text-[#1A0F0A] mb-8">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 border rounded-lg fade-up">
            <div className="text-4xl mb-3">✨</div>
            <h3 className="font-bold text-[#8B3A1A] mb-2">Quality First</h3>
            <p className="text-gray-600">Only the finest leathers and materials</p>
          </div>
          <div className="text-center p-6 border rounded-lg fade-up">
            <div className="text-4xl mb-3">🤝</div>
            <h3 className="font-bold text-[#8B3A1A] mb-2">Customer Trust</h3>
            <p className="text-gray-600">100% satisfaction guaranteed</p>
          </div>
          <div className="text-center p-6 border rounded-lg fade-up">
            <div className="text-4xl mb-3">🌿</div>
            <h3 className="font-bold text-[#8B3A1A] mb-2">Ethical Sourcing</h3>
            <p className="text-gray-600">Sustainable and responsible practices</p>
          </div>
        </div>
      </div>
    </div>
  );
}
