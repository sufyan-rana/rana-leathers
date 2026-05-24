'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from "next/image";

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.fade-up, .fade-in, .scale-in, .stagger-child').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const products = [
    { name: "Premium Leather Jacket", price: "29,999", image: "/images/products/jacket.jpg", slug: "premium-leather-jacket", category: "Outerwear" },
    { name: "Handcrafted Tote Bag", price: "15,999", image: "/images/products/bag.jpg", slug: "handcrafted-tote-bag", category: "Accessories" },
    { name: "Leather Chelsea Boots", price: "18,999", image: "/images/products/boots.jpg", slug: "leather-chelsea-boots", category: "Footwear" },
    { name: "Classic Leather Belt", price: "3,999", image: "/images/products/belt.jpg", slug: "classic-leather-belt", category: "Accessories" },
  ];

  const categories = [
    { name: "Outerwear", icon: "🧥", link: "/products?category=jackets" },
    { name: "Bags", icon: "👜", link: "/products?category=bags" },
    { name: "Belts", icon: "👔", link: "/products?category=belts" },
    { name: "Wallets", icon: "👛", link: "/products?category=wallets" },
    { name: "Footwear", icon: "👞", link: "/products?category=shoes" },
  ];

  const features = [
    { title: "Handcrafted Excellence", desc: "Each piece is crafted by master artisans with decades of experience" },
    { title: "Premium Materials", desc: "Only the finest full-grain leathers from around the world" },
    { title: "Heritage Quality", desc: "Four decades of craftsmanship passed through generations" },
    { title: "Global Shipping", desc: "Delivering excellence to customers worldwide" },
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image - Fixed for local image */}
        <div className="absolute inset-0">
          {(() => {
            try {
              return (
                <Image
                  src="/images/hero/hero-bg.jpg"
                  alt="Hero background"
                  fill
                  className="object-cover"
                  priority
                  onError={(e) => {
                    console.log("Hero image not found, using fallback");
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              );
            } catch {
              return null;
            }
          })()}
          {/* Fallback gradient if image doesn't load */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#F5EFE6] via-[#E8DCD0] to-[#D4C5B0]" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#F5EFE6]/80 via-[#E8DCD0]/70 to-[#D4C5B0]/60" />
        </div>
        
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cpath fill='%238B3A1A' d='M0 0h200v200H0z'/%3E%3C/svg%3E")`,
          backgroundSize: '4px 4px'
        }} />
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-[#D4AF37]/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 fade-up">
          <span className="text-[#8B3A1A] tracking-[0.3em] text-sm uppercase mb-4 inline-block animate-fadeIn">Est. 2010</span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light mb-6 tracking-wide">
            <span className="text-[#3A2A24]">RANA</span>
            <br />
            <span className="text-[#D4AF37] font-normal">LEATHER'S</span>
          </h1>
          <div className="w-12 h-px bg-[#D4AF37] mx-auto my-6" />
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto font-light leading-relaxed text-[#4A3A34]">
            Masterfully handcrafted leather goods from our atelier in Sialkot, Pakistan. 
            Each piece tells a story of heritage and precision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="btn-primary">
              Discover Collection
            </Link>
            <Link href="/materials" className="btn-secondary">
              Our Materials
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-px h-10 bg-[#8B3A1A]/30" />
        </div>
      </section>

      {/* Heritage Section */}
<section className="py-20 md:py-28 bg-white">
  <div className="container-custom">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div className="fade-up">
        <span className="text-[#D4AF37] tracking-[0.2em] text-xs uppercase">Heritage</span>
        <h2 className="text-3xl md:text-4xl font-serif font-light text-[#1A0F0A] mt-2 mb-4">
          Four Decades of Mastery
        </h2>
        <div className="w-12 h-px bg-[#D4AF37] mb-6" />
        <p className="text-gray-600 leading-relaxed mb-4">
          Since 2010, our master artisans have dedicated their lives to the craft of leather making. 
          Each stitch, each cut, each finish is executed with precision passed down through generations.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Today, RANA LEATHER'S stands as a testament to Pakistani craftsmanship—where tradition 
          meets contemporary design.
        </p>
      </div>
      
      {/* Heritage Image - Local Image */}
      <div className="fade-up relative h-96 rounded-lg overflow-hidden shadow-xl" style={{ transitionDelay: '0.2s' }}>
        <img
          src="/images/heritage/workshop.jpg"
          alt="RANA LEATHER'S Artisan Workshop"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          onError={(e) => {
            // Fallback if image doesn't exist
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.style.background = 'linear-gradient(135deg, #8B3A1A, #D4AF37)';
              parent.style.display = 'flex';
              parent.style.alignItems = 'center';
              parent.style.justifyContent = 'center';
              const span = document.createElement('span');
              span.className = 'text-[#F5EFE6] text-6xl opacity-50';
              span.innerHTML = '👜';
              parent.appendChild(span);
            }
          }}
        />
      </div>
    </div>
  </div>
</section>

      {/* Features Section */}
      <section className="py-20 bg-[#F5EFE6]">
        <div className="container-custom">
          <div className="text-center fade-up">
            <span className="text-[#D4AF37] tracking-[0.2em] text-xs uppercase">Why Choose Us</span>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-[#1A0F0A] text-center mb-4">The RANA Standard</h2>
            <div className="w-12 h-px bg-[#D4AF37] mx-auto mb-8" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12 stagger-child">
            {features.map((feature, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-px bg-[#D4AF37] mx-auto mb-4" />
                <h3 className="text-lg font-serif text-[#1A0F0A] mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center fade-up">
            <span className="text-[#D4AF37] tracking-[0.2em] text-xs uppercase">The Collection</span>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-[#1A0F0A] text-center mb-4">Featured Pieces</h2>
            <div className="w-12 h-px bg-[#D4AF37] mx-auto mb-8" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 stagger-child">
            {products.map((product, i) => (
              <Link href={`/products/${product.slug}`} key={i} className="group block">
                <div className="bg-[#F5EFE6] overflow-hidden transition-all duration-500 hover:shadow-xl">
                  <div className="relative h-72 overflow-hidden bg-gradient-to-br from-[#8B3A1A] to-[#D4AF37]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="p-6 text-center">
                    <p className="text-xs text-[#D4AF37] tracking-wider uppercase mb-2">{product.category}</p>
                    <h3 className="font-serif text-lg text-[#1A0F0A] mb-2 group-hover:text-[#8B3A1A] transition duration-300">
                      {product.name}
                    </h3>
                    <p className="text-[#8B3A1A] font-light">Rs. {product.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-12 fade-up">
            <Link href="/products" className="btn-secondary inline-block">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Parallax Workshop Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[#1A0F0A]/90" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600')",
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }} />
        <div className="relative z-10 container-custom text-center text-white">
          <div className="max-w-2xl mx-auto fade-up">
            <span className="text-[#D4AF37] tracking-[0.2em] text-xs uppercase">Artisan Atelier</span>
            <h2 className="text-3xl md:text-4xl font-serif font-light mt-3 mb-4">Where Leather Comes to Life</h2>
            <div className="w-12 h-px bg-[#D4AF37] mx-auto my-6" />
            <p className="text-gray-300 font-light leading-relaxed mb-8">
              Each hide is carefully selected, hand-cut, and stitched in our Sialkot workshop—where 
              passion meets precision.
            </p>
            <Link href="/materials" className="inline-block border border-white/30 hover:bg-white/10 px-8 py-3 transition duration-500 uppercase text-sm tracking-wider">
              Discover Our Process
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-[#F5EFE6]">
        <div className="container-custom">
          <div className="text-center fade-up">
            <span className="text-[#D4AF37] tracking-[0.2em] text-xs uppercase">Shop by Category</span>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-[#1A0F0A] text-center mb-4">Our Collections</h2>
            <div className="w-12 h-px bg-[#D4AF37] mx-auto mb-8" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mt-12 stagger-child">
            {categories.map((cat, i) => (
              <Link key={i} href={cat.link} className="group">
                <div className="bg-white p-6 text-center border border-gray-100 hover:border-[#D4AF37] transition-all duration-500 hover:shadow-lg">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-500">{cat.icon}</div>
                  <h3 className="text-[#1A0F0A] font-light text-sm tracking-wide">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-[#1A0F0A]">
        <div className="container-custom text-center">
          <div className="fade-up">
            <span className="text-[#D4AF37] tracking-[0.2em] text-xs uppercase">Join the Legacy</span>
            <h2 className="text-2xl md:text-3xl font-serif font-light text-white mt-3 mb-4">Subscribe to Our Journal</h2>
            <div className="w-12 h-px bg-[#D4AF37] mx-auto my-6" />
            <p className="text-gray-400 mb-8 max-w-md mx-auto font-light">Receive updates on new collections and artisan stories.</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 px-6 py-3 bg-transparent border border-gray-700 focus:border-[#D4AF37] outline-none text-white transition placeholder:text-gray-500" 
              />
              <button className="btn-primary">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}