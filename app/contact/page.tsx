"use client";

import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="container-custom py-12">
      <h1 className="section-title">Contact Us</h1>
      <div className="section-underline"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div>
          <h2 className="text-2xl font-bold text-[#2C1810] mb-6">Get in Touch</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <MapPin className="text-[#8B4513]" />
              <span>Karachi, Pakistan</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-[#8B4513]" />
              <span>+92 300 2607824</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-[#8B4513]" />
              <span>info@ranaleathers.com</span>
            </div>
          </div>
        </div>
        
        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#2C1810] mb-2">Name</label>
            <input type="text" required className="w-full p-3 border rounded-lg focus:outline-none focus:border-[#8B4513]" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-[#2C1810] mb-2">Email</label>
            <input type="email" required className="w-full p-3 border rounded-lg focus:outline-none focus:border-[#8B4513]" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div>
            <label className="block text-[#2C1810] mb-2">Message</label>
            <textarea required rows={5} className="w-full p-3 border rounded-lg focus:outline-none focus:border-[#8B4513]" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
          </div>
          <button type="submit" className="bg-[#8B4513] text-white px-6 py-3 rounded-lg hover:bg-[#2C1810] transition">Send Message</button>
        </form>
      </div>
    </div>
  );
}
