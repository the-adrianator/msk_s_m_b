'use client';

import LoginScreen from '@/components/LoginScreen';
import { AdminUser } from '@/types';

export default function LoginPage() {
  const handleLogin = (_admin: AdminUser) => {
    // Redirect to dashboard after login
    window.location.href = '/';
  };

  return <LoginScreen onLogin={handleLogin} />;
}
