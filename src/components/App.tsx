'use client';

import { useState, useEffect } from 'react';
import { AdminUser, getCurrentAdmin } from '@/types';
import { getCurrentAdmin as getCurrentAdminService } from '@/services/authService';
import LoginScreen from './LoginScreen';
import DashboardLayout from './DashboardLayout';
import SeedDataButton from './SeedDataButton';

export default function App() {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const currentAdmin = getCurrentAdminService();
    if (currentAdmin) {
      setAdmin(currentAdmin);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (loggedInAdmin: AdminUser) => {
    setAdmin(loggedInAdmin);
  };

  const handleLogout = () => {
    setAdmin(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <DashboardLayout admin={admin} onLogout={handleLogout}>
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Stage 2 Complete: Mock Admin Auth & Theme System
        </h2>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">Login screen with demo credentials</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">Role-based permission gating</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">Light/dark theme toggle with persistence</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">Mock session management</span>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Current User: {admin.name}
          </h3>
          <p className="text-blue-700 dark:text-blue-200 text-sm">
            Role: {admin.role} • Permissions: {admin.permissions.join(', ')}
          </p>
        </div>

        <SeedDataButton />
        
        <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
            Next Steps
          </h3>
          <p className="text-green-700 dark:text-green-200 text-sm">
            Ready to proceed to Stage 3: Dashboard (Desktop). This will include the main suggestion table 
            with filters, search, sorting, and inline status updates.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
