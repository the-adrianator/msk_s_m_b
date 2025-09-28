'use client';

import { useState, useEffect } from 'react';
import { AdminUser } from '@/types';
import { getCurrentAdmin } from '@/services/authService';
import LoginScreen from '@/components/LoginScreen';
import DashboardLayout from '@/components/DashboardLayout';
import SuggestionTable from '@/components/SuggestionTable';

export default function SuggestionsPage() {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const adminUser = getCurrentAdmin();
    if (adminUser) {
      setAdmin(adminUser);
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = (loggedInAdmin: AdminUser) => {
    setAdmin(loggedInAdmin);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
        Loading application...
      </div>
    );
  }

  if (!admin) {
    return <LoginScreen onLogin={handleLoginSuccess} />;
  }

  return (
    <DashboardLayout admin={admin}>
      <div className="w-full overflow-x-hidden">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          All Suggestions
        </h2>
        <SuggestionTable admin={admin} />
      </div>
    </DashboardLayout>
  );
}
