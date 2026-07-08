'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag, Heart, User, LogOut, Shield } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import LoginModal from '@/components/ui/LoginModal';

// ============================================================
// 🎨 COLOR CONFIGURATION SECTION - CHANGE COLORS HERE
// ============================================================

const COLORS = {
  // NAVBAR BACKGROUND COLORS
  navbarBg: "#3a3835",           // Navbar color when at top
  navbarBgScrolled: "#665e52",   // Navbar color after scrolling

  // TEXT COLORS (Home, Products, Materials, About, Contact)
  textDefault: "#ece2eca9",      // Normal text color
  textHover: "#2faeb3",          // Text color on hover
  textActive: "#60beba",         // Active page text color

  // LOGO COLORS
  logoPrimary: "#8B3A1A",        // "RANA" color
  logoSecondary: "#D4AF37",      // "LEATHER'S" color
  logoEst: "#8B3A1A",            // "Est. 2010" color
  logoBorder: "#D4AF37",         // Logo icon border
  logoIcon: "#D4AF37",           // "R" inside logo

  // ICON COLORS
  iconDefault: "#b9b9b9ab",      // Cart/Wishlist icon color
  iconHover: "#0e0c0c",          // Icon color on hover

  // CART BADGE COLORS
  badgeBg: "#D4AF37",            // Cart badge background
  badgeText: "#1A0F0A",          // Cart badge number color

  // MOBILE MENU COLORS
  mobileBg: "#F5EFE6",           // Mobile menu background
  mobileText: "#3A2A24",         // Mobile menu text color
  mobileBorder: "rgba(0,0,0,0.05)", // Border between items

  // UNDERLINE COLOR
  activeUnderline: "#D4AF37",    // Active page underline color
};

// ============================================================
// NAVIGATION LINKS - Add or remove menu items here
// ============================================================

// Base navigation for all users
const baseNavigation = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Materials", href: "/materials" },
  { name: "Collections", href: "/collections" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

// Admin navigation (will be conditionally added)
const adminLink = { name: "Admin", href: "/admin", icon: Shield };

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);

  // Build navigation dynamically based on user role
  const navigation = [...baseNavigation];
  
  // Check if user is admin (either by email or role)
if (user?.email === 'ranaleathers58@gmail.com' || user?.role === 'admin') {
    navigation.push(adminLink);
  }

  // Detect scroll to change navbar style
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when changing pages
  useEffect(() => {
    setIsOpen(false);
    setShowUserMenu(false);
  }, [pathname]);

  // Get cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const cart = localStorage.getItem("cart");
      if (cart) {
        const items = JSON.parse(cart);
        const total = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
        setCartCount(total);
      } else {
        setCartCount(0);
      }
    };

    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    
    // Custom event for cart updates
    window.addEventListener("cartUpdated", updateCartCount);
    
    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  // Dynamic background based on scroll position
  const navbarStyle = {
    backgroundColor: scrolled ? COLORS.navbarBgScrolled : COLORS.navbarBg,
    transition: 'all 0.5s ease',
  };

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  return (
    <>
      {/* Main Navbar */}
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-500 py-3`}
        style={navbarStyle}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            
            {/* ============================================
                LOGO SECTION
               ============================================ */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div 
                  className="w-10 h-10 border-2 rotate-45 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  style={{ borderColor: COLORS.logoBorder }}
                >
                  <div 
                    className="w-6 h-6 border -rotate-45 flex items-center justify-center"
                    style={{ borderColor: COLORS.logoPrimary }}
                  >
                    <span 
                      className="text-xs font-serif rotate-45"
                      style={{ color: COLORS.logoIcon }}
                    >
                      R
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-xl font-serif font-bold tracking-wide leading-tight">
                  <span style={{ color: COLORS.logoPrimary }}>RANA</span>
                  <span style={{ color: COLORS.logoSecondary }}>LEATHER'S</span>
                </span>
                <span 
                  className="text-[8px] tracking-[0.2em] uppercase"
                  style={{ color: COLORS.logoEst }}
                >
                  Est. 2010
                </span>
              </div>
            </Link>

            {/* ============================================
                DESKTOP NAVIGATION
               ============================================ */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative py-1 transition duration-300 text-sm tracking-wide ${
                      isActive ? "font-medium" : ""
                    }`}
                    style={{ 
                      color: isActive ? COLORS.textActive : COLORS.textDefault,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.color = COLORS.textHover;
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.color = COLORS.textDefault;
                    }}
                  >
                    {item.name}
                    {isActive && (
                      <span 
                        className="absolute -bottom-1 left-0 w-full h-px"
                        style={{ backgroundColor: COLORS.activeUnderline }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* ============================================
                DESKTOP ICONS - Cart, Wishlist & User
               ============================================ */}
            <div className="hidden md:flex items-center space-x-5">
              <Link 
                href="/wishlist" 
                className="transition"
                style={{ color: COLORS.iconDefault }}
                onMouseEnter={(e) => e.currentTarget.style.color = COLORS.iconHover}
                onMouseLeave={(e) => e.currentTarget.style.color = COLORS.iconDefault}
              >
                <Heart size={18} />
              </Link>
              
              <Link 
                href="/cart" 
                className="transition relative"
                style={{ color: COLORS.iconDefault }}
                onMouseEnter={(e) => e.currentTarget.style.color = COLORS.iconHover}
                onMouseLeave={(e) => e.currentTarget.style.color = COLORS.iconDefault}
              >
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <span 
                    className="absolute -top-2 -right-3 text-[10px] rounded-full w-4 h-4 flex items-center justify-center"
                    style={{ backgroundColor: COLORS.badgeBg, color: COLORS.badgeText }}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Authentication Section */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 transition"
                    style={{ color: COLORS.iconDefault }}
                    onMouseEnter={(e) => e.currentTarget.style.color = COLORS.iconHover}
                  >
                    <User size={18} />
                    <span className="text-sm">{user?.name?.split(' ')[0]}</span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="transition flex items-center gap-1"
                  style={{ color: COLORS.iconDefault }}
                  onMouseEnter={(e) => e.currentTarget.style.color = COLORS.iconHover}
                  onMouseLeave={(e) => e.currentTarget.style.color = COLORS.iconDefault}
                >
                  <User size={18} />
                  <span className="text-sm">Sign In</span>
                </button>
              )}
            </div>

            {/* ============================================
                MOBILE MENU BUTTON
               ============================================ */}
            <button 
              className="md:hidden transition"
              onClick={() => setIsOpen(!isOpen)}
              style={{ color: COLORS.iconDefault }}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ============================================
          MOBILE SLIDE-OUT MENU
         ============================================ */}
      <div 
        className={`fixed inset-0 z-40 transform transition-transform duration-400 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ backgroundColor: COLORS.mobileBg }}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-xl transition font-light tracking-wide"
              style={{ color: COLORS.mobileText }}
              onMouseEnter={(e) => e.currentTarget.style.color = COLORS.textHover}
              onMouseLeave={(e) => e.currentTarget.style.color = COLORS.mobileText}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          
          {/* Mobile Menu Icons */}
          <div className="flex gap-8 pt-8">
            <Link 
              href="/wishlist" 
              style={{ color: COLORS.mobileText }}
              onClick={() => setIsOpen(false)}
            >
              <Heart size={22} />
            </Link>
            <Link 
              href="/cart" 
              style={{ color: COLORS.mobileText }}
              onClick={() => setIsOpen(false)}
            >
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="ml-1 text-xs">({cartCount})</span>
              )}
            </Link>
          </div>

          {/* Mobile Auth Section */}
          <div className="pt-4 border-t border-gray-200 w-48 text-center">
            {isAuthenticated ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">{user?.name}</p>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setShowLoginModal(true);
                  setIsOpen(false);
                }}
                className="text-sm"
                style={{ color: COLORS.mobileText }}
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}