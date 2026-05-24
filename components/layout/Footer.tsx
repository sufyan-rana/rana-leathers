import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#2C1810] text-white mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4">RANA <span className="text-[#C8A951]"> LEATHER'S</span></h3>
            <p className="text-gray-400 text-sm">Premium handcrafted leather products since 2010.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/products" className="hover:text-[#C8A951]">Products</Link></li>
              <li><Link href="/about" className="hover:text-[#C8A951]">About</Link></li>
              <li><Link href="/contact" className="hover:text-[#C8A951]">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2"><MapPin size={16} /> Karachi , Pakistan</li>
              <li className="flex items-center gap-2"><Phone size={16} /> +92 300 2607824</li>
              <li className="flex items-center gap-2"><Mail size={16} /> info@ranaleathers.com</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <Facebook className="hover:text-[#C8A951] cursor-pointer" size={20} />
              <Instagram className="hover:text-[#C8A951] cursor-pointer" size={20} />
              <Twitter className="hover:text-[#C8A951] cursor-pointer" size={20} />
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} RANA LEATHER'S. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
