'use client';

import { useState } from 'react';
import { AdminUser, Suggestion } from '@/types';
import PermissionGuard from './PermissionGuard';
import SuggestionTable from './SuggestionTable';
import CreateSuggestionModal from './CreateSuggestionModal';
import SeedDataButton from './SeedDataButton';

interface DashboardLandingProps {
  admin: AdminUser;
  onLogout: () => void;
}

type ViewMode = 'landing' | 'suggestions' | 'create';

export default function DashboardLanding({
  admin,
  onLogout,
}: DashboardLandingProps) {
  const [currentView, setCurrentView] = useState<ViewMode>('landing');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateSuggestion = (newSuggestion: Suggestion) => {
    // This will be handled by the SuggestionTable component
    setCurrentView('suggestions');
    setIsCreateModalOpen(false);
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  if (currentView === 'suggestions') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBackToLanding}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dashboard
          </button>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Suggestions Management
          </h2>
        </div>
        <SuggestionTable admin={admin} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {admin.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {admin.role} • {admin.email}
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Create Suggestions Card */}
        <PermissionGuard permission="create_suggestions" admin={admin}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="h-6 w-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Create Suggestions
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Create new MSK risk reduction suggestions for employees
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Create New Suggestion
              </button>
            </div>
          </div>
        </PermissionGuard>

        {/* Manage Suggestions Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="h-6 w-6 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Update Status
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Update the status of existing suggestions
            </p>
            <button
              onClick={() => setCurrentView('suggestions')}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
            >
              Manage Suggestions
            </button>
          </div>
        </div>

        {/* View All Data Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="h-6 w-6 text-purple-600 dark:text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              View All Data
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Access all suggestions and employee data
            </p>
            <button
              onClick={() => setCurrentView('suggestions')}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
            >
              View Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Seed Data Section */}
      {/* <div className="mt-8">
        <SeedDataButton />
      </div> */}

      {/* Create Suggestion Modal */}
      <CreateSuggestionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuggestion}
        admin={admin}
      />
    </div>
  );
}
