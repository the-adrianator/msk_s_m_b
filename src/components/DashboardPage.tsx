'use client';

import { useState, useEffect } from 'react';
import { AdminUser, Suggestion, Employee } from '@/types';
import { getSuggestions } from '@/services/suggestionService';
import { getEmployees } from '@/services/employeeService';
import PermissionGuard from './PermissionGuard';
import CreateSuggestionModal from './CreateSuggestionModal';
import StatusUpdateModal from './StatusUpdateModal';
import Toast from './Toast';
import SuggestionCard from './SuggestionCard';
import { useRouter } from 'next/navigation';
import { PlusIcon, ListBulletIcon } from '@heroicons/react/24/solid';

interface DashboardPageProps {
  admin: AdminUser;
}

export default function DashboardPage({ admin }: DashboardPageProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<Suggestion | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false,
  });
  const [recentSuggestions, setRecentSuggestions] = useState<Suggestion[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showAllRecent, setShowAllRecent] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    high: 0,
    medium: 0,
    low: 0,
  });
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [suggestions, employeesData] = await Promise.all([
          getSuggestions(),
          getEmployees(),
        ]);

        setEmployees(employeesData);
        setRecentSuggestions(
          suggestions
            .sort(
              (a, b) =>
                new Date(b.dateUpdated).getTime() -
                new Date(a.dateUpdated).getTime()
            )
            .slice(0, 6)
        );

        // Calculate stats
        const newStats = {
          total: suggestions.length,
          pending: suggestions.filter(s => s.status === 'pending').length,
          inProgress: suggestions.filter(s => s.status === 'in_progress')
            .length,
          completed: suggestions.filter(s => s.status === 'completed').length,
          high: suggestions.filter(s => s.priority === 'high').length,
          medium: suggestions.filter(s => s.priority === 'medium').length,
          low: suggestions.filter(s => s.priority === 'low').length,
        };
        setStats(newStats);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        showToast('Failed to load dashboard data.', 'error');
      }
    };
    fetchData();
  }, []);

  const handleCreateSuggestion = (newSuggestion: Suggestion) => {
    setRecentSuggestions(prev => {
      const updated = [newSuggestion, ...prev]
        .sort(
          (a, b) =>
            new Date(b.dateUpdated).getTime() -
            new Date(a.dateUpdated).getTime()
        )
        .slice(0, 6);
      return updated;
    });
    setStats(prev => ({
      ...prev,
      total: prev.total + 1,
      [newSuggestion.status === 'pending'
        ? 'pending'
        : newSuggestion.status === 'in_progress'
          ? 'inProgress'
          : 'completed']:
        prev[
          newSuggestion.status === 'pending'
            ? 'pending'
            : newSuggestion.status === 'in_progress'
              ? 'inProgress'
              : 'completed'
        ] + 1,
      [newSuggestion.priority]: prev[newSuggestion.priority] + 1,
    }));
    setToast({
      message: 'Suggestion created successfully!',
      type: 'success',
      isVisible: true,
    });
    setIsCreateModalOpen(false);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const handleOpenStatusModal = (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
    setIsStatusModalOpen(true);
  };

  const handleCloseStatusModal = () => {
    setIsStatusModalOpen(false);
    setSelectedSuggestion(null);
  };

  const handleUpdateSuggestion = (updatedSuggestion: Suggestion) => {
    setRecentSuggestions(prev =>
      prev.map(suggestion =>
        suggestion.id === updatedSuggestion.id ? updatedSuggestion : suggestion
      )
    );
    setToast({
      message: 'Suggestion updated successfully!',
      type: 'success',
      isVisible: true,
    });
    handleCloseStatusModal();
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee?.name || 'Unknown Employee';
  };

  const StatCard = ({
    title,
    value,
    className = '',
  }: {
    title: string;
    value: string | number;
    className?: string;
  }) => (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 ${className}`}
    >
      <p className="text-sm font-bold text-gray-900 dark:text-white text-center sm:text-left">
        {title}
      </p>
      <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white text-center sm:text-left">
        {value}
      </p>
    </div>
  );

  return (
    <div className="max-w-full mx-auto">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Manage MSK health suggestions for your employees
          </p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <PermissionGuard permission="create_suggestions" admin={admin}>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Create Suggestion
            </button>
          </PermissionGuard>
          <button
            onClick={() => router.push('/suggestions')}
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
          >
            <ListBulletIcon className="w-4 h-4 mr-2" />
            View All Suggestions
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {/* Total Suggestions (Large Card) */}
        <StatCard
          title="Total Suggestions"
          value={stats.total}
          className="col-span-2 lg:col-span-1 lg:row-span-2"
        />

        {/* Row 1 */}
        <StatCard title="Pending" value={stats.pending} />
        <StatCard title="In Progress" value={stats.inProgress} />
        <StatCard title="Completed" value={stats.completed} />

        {/* Row 2 */}
        <StatCard title="High Priority" value={stats.high} />
        <StatCard title="Medium Priority" value={stats.medium} />
        <StatCard title="Low Priority" value={stats.low} />
      </div>

      {/* Recent Suggestions Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Recent Suggestions
          </h2>
          {recentSuggestions.length > 3 && (
            <button
              onClick={() => setShowAllRecent(!showAllRecent)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
            >
              {showAllRecent ? (
                <>
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                  Show Less
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  Show All ({recentSuggestions.length})
                </>
              )}
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 items-start">
          {recentSuggestions
            .slice(0, showAllRecent ? recentSuggestions.length : 3)
            .map((suggestion, index) => (
              <SuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                employeeName={getEmployeeName(suggestion.employeeId)}
                admin={admin}
                onUpdate={handleOpenStatusModal}
                isExpanded={false} // All cards start collapsed
                showExpandButton={true} // Enable individual card expand/collapse
              />
            ))}
          {recentSuggestions.length === 0 && (
            <div className="lg:col-span-3">
              <p className="text-center text-gray-500 dark:text-gray-400">
                No recent suggestions found.
              </p>
            </div>
          )}
        </div>
      </div>

      <CreateSuggestionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuggestion}
        admin={admin}
      />

      {selectedSuggestion && (
        <StatusUpdateModal
          suggestion={selectedSuggestion}
          isOpen={isStatusModalOpen}
          onClose={handleCloseStatusModal}
          onUpdate={handleUpdateSuggestion}
        />
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}
