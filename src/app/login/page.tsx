'use client';

import LoginScreen from '@/components/LoginScreen';

export default function LoginPage() {
  const handleLogin = () => {
    // Redirect to dashboard after login
    window.location.href = '/';
  };

  return <LoginScreen onLogin={handleLogin} />;
}
