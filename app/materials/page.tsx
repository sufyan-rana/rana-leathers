'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function MaterialsPage() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-up, .fade-in, .scale-in').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const leathers = [
    {
      name: "Full-Grain Buffalo",
      origin: "Punjab, Pakistan",
      description: "The pinnacle of leather quality. Full-grain buffalo leather retains the natural grain pattern, making each piece unique. Develops a rich patina over time.",
      characteristics: ["Durable", "Develops patina", "Breathable", "Unique grain pattern"],
      use: "Jackets, Bags, Belts",
      image: "/images/materials/full-grain-buffalo.jpg",
      fallbackIcon: "🐃"
    },
    {
      name: "Vachetta Leather",
      origin: "Tuscany, Italy",
      description: "Vegetable-tanned leather that ages beautifully. Natural and untreated, it develops a golden-brown patina with exposure to sunlight and use.",
      characteristics: ["Vegetable-tanned", "Natural finish", "Develops patina", "Soft to touch"],
      use: "Premium Bags, Wallets",
      image: "/images/materials/vachetta.jpg",
      fallbackIcon: "🇮🇹"
    },
    {
      name: "Saffiano Leather",
      origin: "Milan, Italy",
      description: "Cross-hatch pattern leather with wax finish. Highly resistant to scratches and water stains. Maintains its structure perfectly.",
      characteristics: ["Scratch-resistant", "Water-resistant", "Structured", "Easy to clean"],
      use: "Wallets, Bags, Cardholders",
      image: "/images/materials/saffiano.jpg",
      fallbackIcon: "✨"
    },
    {
      name: "Exotic Nile Hide",
      origin: "Nile Valley, Egypt",
      description: "Rare and distinctive leather with unique scaling patterns. Each hide tells a story of the Nile's ancient craftsmanship tradition.",
      characteristics: ["Unique scale pattern", "Rare material", "Distinctive texture", "Luxury grade"],
      use: "Limited Edition Pieces",
      image: "/images/materials/exotic-nile.jpg",
      fallbackIcon: "🐊"
    }
  ];

  const components = [
    {
      name: "Solid Brass Hardware",
      description: "Each buckle, zipper, and rivet is crafted from solid brass, then finished with a protective PVD coating. Resistant to tarnishing and wear.",
      features: ["PVD coated", "Tarnish-resistant", "Hand-polished", "Heirloom quality"],
      icon: "🔩"
    },
    {
      name: "Waxed Linen Thread",
      description: "Sourced from France, our thread is pre-waxed for water resistance and durability. Each stitch is locked by hand for structural integrity.",
      features: ["Water-resistant", "UV resistant", "High tensile strength", "Hand-waxed"],
      icon: "🧵"
    },
    {
      name: "Edging Paint",
      description: "Italian edge paint applied in multiple layers, sanded between each coat. Creates a smooth, durable finish that seals the leather edge.",
      features: ["Flexible", "Durable", "Color-matched", "UV resistant"],
      icon: "🎨"
    }
  ];

  return (
    <main className="bg-[#F5EFE6]">
      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#1A0F0A]" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cpath fill='%23D4AF37' d='M0 0h200v200H0z'/%3E%3C/svg%3E")`,
          backgroundSize: '4px 4px'
        }} />
        <div className="relative z-10 text-center text-white px-4 fade-up">
          <span className="text-[#D4AF37] tracking-[0.3em] text-sm uppercase mb-4 inline-block">Archive</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light mb-4 tracking-wide">
            The Materials Archive
          </h1>
          <div className="w-12 h-px bg-[#D4AF37] mx-auto my-6" />
          <p className="text-lg max-w-2xl mx-auto font-light leading-relaxed">
            An exploration of the hides, hardware, and craftsmanship that define RANA LEATHER'S.
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center fade-up">
            <p className="text-gray-600 leading-relaxed mb-4">
              For nearly two decades, we have sourced the world's finest materials. 
              From the buffalo hides of Punjab to the solid brass of Italian foundries, 
              every component is chosen for its character and durability.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Below, explore the materials that define our legacy.
            </p>
          </div>
        </div>
      </section>

      {/* Leather Collection */}
      <section className="py-20 bg-[#F5EFE6]">
        <div className="container-custom">
          <div className="text-center fade-up">
            <span className="text-[#D4AF37] tracking-[0.2em] text-xs uppercase">The Hides</span>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-[#1A0F0A] mt-2 mb-4">Our Leathers</h2>
            <div className="w-12 h-px bg-[#D4AF37] mx-auto mb-8" />
          </div>

          <div className="space-y-16 mt-8">
            {leathers.map((leather, index) => (
              <div key={index} className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center fade-up`} style={{ transitionDelay: `${index * 0.1}s` }}>
                <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                  <div className="bg-gradient-to-br from-[#8B3A1A] to-[#D4AF37] h-80 rounded-lg flex items-center justify-center overflow-hidden relative">
                    <img
                      src={leather.image}
                      alt={leather.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.style.display = 'flex';
                          parent.style.justifyContent = 'center';
                          parent.style.alignItems = 'center';
                          const fallbackSpan = document.createElement('span');
                          fallbackSpan.className = 'text-7xl';
                          fallbackSpan.textContent = leather.fallbackIcon;
                          parent.appendChild(fallbackSpan);
                        }
                      }}
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-serif text-[#1A0F0A] mb-2">{leather.name}</h3>
                  <p className="text-sm text-[#D4AF37] mb-4">Sourced from {leather.origin}</p>
                  <p className="text-gray-600 leading-relaxed mb-4">{leather.description}</p>
                  <div className="mb-4">
                    <h4 className="font-semibold text-[#1A0F0A] mb-2">Characteristics:</h4>
                    <div className="flex flex-wrap gap-2">
                      {leather.characteristics.map((char, i) => (
                        <span key={i} className="text-xs bg-white px-3 py-1 text-gray-600 border border-gray-200 rounded-full">{char}</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500"><span className="font-semibold">Used in:</span> {leather.use}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hardware & Components */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center fade-up">
            <span className="text-[#D4AF37] tracking-[0.2em] text-xs uppercase">The Details</span>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-[#1A0F0A] mt-2 mb-4">Hardware & Thread</h2>
            <div className="w-12 h-px bg-[#D4AF37] mx-auto mb-12" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-child">
            {components.map((component, index) => (
              <div key={index} className="bg-[#F5EFE6] p-8 rounded-lg hover:shadow-lg transition-all duration-300">
                <div className="text-5xl mb-4">{component.icon}</div>
                <h3 className="text-xl font-serif text-[#1A0F0A] mb-3">{component.name}</h3>
                <p className="text-gray-600 leading-relaxed mb-4 text-sm">{component.description}</p>
                <ul className="space-y-1">
                  {component.features.map((feature, i) => (
                    <li key={i} className="text-sm text-gray-500 flex items-center gap-2">
                      <span className="text-[#D4AF37]">✓</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Heritage Timeline */}
      <section className="py-20 bg-[#1A0F0A] text-white">
        <div className="container-custom">
          <div className="text-center fade-up">
            <span className="text-[#D4AF37] tracking-[0.2em] text-xs uppercase">Legacy</span>
            <h2 className="text-3xl md:text-4xl font-serif font-light mt-2 mb-4">A Timeline of Craft</h2>
            <div className="w-12 h-px bg-[#D4AF37] mx-auto mb-12" />
          </div>

          <div className="max-w-3xl mx-auto space-y-8">
            {[
              { year: "2010", event: "RANA LEATHER'S founded in Karachi, Pakistan. The first workshop opens with three master artisans." },
              { year: "2015", event: "International expansion begins. First export of handcrafted leather jackets to Europe." },
              { year: "2018", event: "New atelier established. Introduces full-grain buffalo leather collection." },
              { year: "2022", event: "Collaboration with Italian tanneries begins. Saffiano and Vachetta leathers introduced." },
              { year: "2024", event: "Present day — Continuing the legacy with fourth-generation artisans." },
            ].map((item, index) => (
              <div key={index} className="flex gap-6 fade-up" style={{ transitionDelay: `${index * 0.1}s` }}>
                <div className="text-right min-w-[80px]">
                  <span className="text-[#D4AF37] font-serif text-xl">{item.year}</span>
                </div>
                <div>
                  <div className="w-px h-full bg-[#D4AF37]/30 mx-4" />
                </div>
                <div>
                  <p className="text-gray-300 leading-relaxed">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Craftsmanship Quote */}
      <section className="py-20 bg-[#F5EFE6]">
        <div className="container-custom text-center">
          <div className="max-w-2xl mx-auto fade-up">
            <span className="text-6xl text-[#D4AF37] font-serif">"</span>
            <p className="text-xl md:text-2xl font-serif font-light text-[#1A0F0A] italic mt-4 mb-6 leading-relaxed">
              We believe the best materials deserve the finest craftsmanship. Every hide is honored, every stitch intentional.
            </p>
            <span className="text-6xl text-[#D4AF37] font-serif align-top">"</span>
            <div className="mt-8">
              <p className="text-[#1A0F0A] font-semibold">— Master Artisan, RANA LEATHER'S</p>
              <p className="text-sm text-gray-500 mt-1">Second Generation Craftsman</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#8B3A1A]">
        <div className="container-custom text-center">
          <div className="fade-up">
            <h2 className="text-2xl md:text-3xl font-serif font-light text-white mb-4">Experience the Craft</h2>
            <div className="w-12 h-px bg-[#D4AF37] mx-auto my-6" />
            <p className="text-gray-200 mb-8 max-w-md mx-auto font-light">Shop our collection of handcrafted leather goods.</p>
            <Link href="/products" className="inline-block border border-white/30 hover:bg-white/10 text-white px-8 py-3 transition duration-500 uppercase text-sm tracking-wider">
              Explore Collection
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}