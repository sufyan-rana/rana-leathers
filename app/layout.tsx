import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import ChatWidget from '@/components/chat/ChatWidget';

export const metadata: Metadata = {
  title: "RANA LEATHER'S - Premium Handcrafted Leather Products",
  description: "Masterfully handcrafted leather goods from our atelier in Sialkot, Pakistan. Established 2010.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#F5EFE6]">
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen pt-24">
            {children}
          </main>
          <Footer />
          <ChatWidget /> 
        </AuthProvider>
      </body>
    </html>
  );
}