'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function CollectionsPage() {
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

  const collections = [
    {
      name: "Winter Collection",
      description: "Stay warm with our premium leather jackets and boots. Perfect for the cold season.",
      price: "From Rs. 18,999",
      image: "/images/collections/winter-collection.jpg",
      link: "/products?category=jackets",
      icon: "❄️",
      colors: ["#8B3A1A", "#D4AF37", "#1A0F0A"]
    },
    {
      name: "Premium Leather",
      description: "Our finest handcrafted pieces made from the highest quality full-grain leather.",
      price: "From Rs. 29,999",
      image: "/images/collections/premium-leather.jpg",
      link: "/products",
      icon: "✨",
      colors: ["#D4AF37", "#8B3A1A", "#F5EFE6"]
    },
    {
      name: "Gift Sets",
      description: "Perfect gifts for your loved ones. Specially curated leather accessory sets.",
      price: "From Rs. 5,999",
      image: "/images/collections/gift-sets.jpg",
      link: "/products",
      icon: "🎁",
      colors: ["#D4AF37", "#8B3A1A", "#F5EFE6"]
    },
    {
      name: "Eid Collection",
      description: "Special edition pieces for the festive season. Elegant and timeless.",
      price: "From Rs. 12,999",
      image: "/images/collections/eid-collection.jpg",
      link: "/products",
      icon: "🌙",
      colors: ["#D4AF37", "#8B3A1A", "#1A0F0A"]
    },
    {
      name: "Office Essentials",
      description: "Professional leather bags, briefcases, and accessories for the workplace.",
      price: "From Rs. 8,999",
      image: "/images/collections/office-essentials.jpg",
      link: "/products",
      icon: "💼",
      colors: ["#1A0F0A", "#8B3A1A", "#D4AF37"]
    }
  ];

  return (
    <main className="bg-[#F5EFE6]">
      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A0F0A] to-[#8B3A1A]" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cpath fill='%23D4AF37' d='M0 0h200v200H0z'/%3E%3C/svg%3E")`,
          backgroundSize: '4px 4px'
        }} />
        <div className="relative z-10 text-center text-white px-4 fade-up">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light mb-4 tracking-wide">
            Our Collections
          </h1>
          <div className="w-12 h-px bg-[#D4AF37] mx-auto my-6" />
          <p className="text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Discover our curated collections of handcrafted leather masterpieces
          </p>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((collection, index) => (
              <div 
                key={index} 
                className="fade-up group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-[#8B3A1A] to-[#D4AF37]">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      // Fallback if image doesn't exist
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.style.display = 'flex';
                        parent.style.alignItems = 'center';
                        parent.style.justifyContent = 'center';
                        const span = document.createElement('span');
                        span.className = 'text-7xl opacity-70';
                        span.innerHTML = collection.icon;
                        parent.appendChild(span);
                      }
                    }}
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Icon Badge */}
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-2xl">
                    {collection.icon}
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 text-center">
                  <h3 className="text-xl font-serif font-semibold text-[#1A0F0A] mb-2 group-hover:text-[#8B3A1A] transition">
                    {collection.name}
                  </h3>
                  <div className="w-12 h-px bg-[#D4AF37] mx-auto my-3" />
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {collection.description}
                  </p>
                  <p className="text-[#8B3A1A] font-semibold text-sm mb-4">
                    {collection.price}
                  </p>
                  <Link 
                    href={collection.link} 
                    className="inline-block border border-[#8B3A1A] text-[#8B3A1A] hover:bg-[#8B3A1A] hover:text-white px-6 py-2 transition duration-300 text-sm uppercase tracking-wider"
                  >
                    Shop Collection
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collection Banner */}
      <section className="py-16 bg-[#1A0F0A]">
        <div className="container-custom text-center">
          <div className="fade-up">
            <span className="text-[#D4AF37] tracking-[0.2em] text-xs uppercase">Limited Edition</span>
            <h2 className="text-2xl md:text-3xl font-serif font-light text-white mt-3 mb-4">
              Bespoke Custom Orders
            </h2>
            <div className="w-12 h-px bg-[#D4AF37] mx-auto my-6" />
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto font-light">
              Looking for something unique? Contact us for custom-made leather pieces tailored to your specifications.
            </p>
            <Link 
              href="/contact" 
              className="inline-block border border-white/30 hover:bg-white/10 text-white px-8 py-3 transition duration-500 uppercase text-sm tracking-wider"
            >
              Inquire Now
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}