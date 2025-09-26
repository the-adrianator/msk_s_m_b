'use client';

import { AdminUser } from '@/types';
import Header from './Header';
import PermissionGuard from './PermissionGuard';

interface DashboardLayoutProps {
  admin: AdminUser;
  onLogout: () => void;
  children: React.ReactNode;
}

export default function DashboardLayout({ admin, onLogout, children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header admin={admin} onLogout={onLogout} />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome message with role-based content */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back, {admin.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {admin.role} • {admin.email}
            </p>
          </div>

          {/* Permission-based content sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Create Suggestions Card */}
            <PermissionGuard 
              permission="create_suggestions" 
              admin={admin}
              fallback={
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Create Suggestions
                  </h3>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    You don't have permission to create suggestions
                  </p>
                </div>
              }
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Create Suggestions
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Create new MSK risk reduction suggestions for employees
                </p>
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Create New Suggestion
                </button>
              </div>
            </PermissionGuard>

            {/* Update Status Card */}
            <PermissionGuard 
              permission="update_status" 
              admin={admin}
              fallback={
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Update Status
                  </h3>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    You don't have permission to update suggestion status
                  </p>
                </div>
              }
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Update Status
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Update the status of existing suggestions
                </p>
                <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                  Manage Suggestions
                </button>
              </div>
            </PermissionGuard>

            {/* View All Card */}
            <PermissionGuard 
              permission="view_all" 
              admin={admin}
              fallback={
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
                    View Data
                  </h3>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    You don't have permission to view all data
                  </p>
                </div>
              }
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  View All Data
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Access all suggestions and employee data
                </p>
                <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                  View Dashboard
                </button>
              </div>
            </PermissionGuard>
          </div>

          {/* Main content area */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
