// app/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoginModal from '@/components/ui/LoginModal';

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(true);

  // If user is already logged in, redirect to home or checkout
  useEffect(() => {
    if (user) {
      const redirectUrl = sessionStorage.getItem('redirectAfterLogin') || '/';
      sessionStorage.removeItem('redirectAfterLogin');
      router.push(redirectUrl);
    }
  }, [user, router]);

  const handleClose = () => {
    setIsModalOpen(false);
    router.push('/');
  };

  const handleSuccess = () => {
    const redirectUrl = sessionStorage.getItem('redirectAfterLogin') || '/';
    sessionStorage.removeItem('redirectAfterLogin');
    router.push(redirectUrl);
  };

  return (
    <div className="min-h-screen bg-[#F5EFE6]">
      <LoginModal 
        isOpen={isModalOpen} 
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    </div>
  );
}