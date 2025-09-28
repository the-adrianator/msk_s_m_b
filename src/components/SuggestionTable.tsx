'use client';

import { useState, useEffect } from 'react';
import {
  Suggestion,
  Employee,
  SuggestionFilters,
  SortField,
  SortDirection,
} from '@/types';
import { getSuggestions } from '@/services/suggestionService';
import { getEmployees } from '@/services/employeeService';
import { filterSuggestions, sortSuggestions } from '@/utils/filters';
import { formatDate, getRelativeTime, isOverdue } from '@/utils/dates';
import { AdminUser } from '@/types';
import PermissionGuard from './PermissionGuard';
import StatusUpdateModal from './StatusUpdateModal';
import SuggestionCard from './SuggestionCard';
import EmployeeDrawer from './EmployeeDrawer';
import CreateSuggestionModal from './CreateSuggestionModal';
import Toast from './Toast';
import EmptyState from './EmptyState';
import { TableSkeleton, CardSkeleton } from './LoadingSkeleton';
import SuggestionTableData from './SuggestionTableData';
import { useTheme } from '@/contexts/ThemeContext';
import {
  getThemeCardClasses,
  getThemeTextClasses,
  getThemeBorderClasses,
} from '@/utils/themeClasses';

interface SuggestionTableProps {
  admin: AdminUser;
}

export default function SuggestionTable({ admin }: SuggestionTableProps) {
  const { theme } = useTheme();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Suggestion[]>(
    []
  );
  const [filters, setFilters] = useState<SuggestionFilters>({});
  const [sortField, setSortField] = useState<SortField>('dateUpdated');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<Suggestion | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [suggestionsData, employeesData] = await Promise.all([
          getSuggestions(),
          getEmployees(),
        ]);
        setSuggestions(suggestionsData);
        setEmployees(employeesData);
      } catch (err) {
        setError('Failed to load data');
        console.error('Error loading data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Apply filters and sorting when data or filters change
  useEffect(() => {
    let filtered = filterSuggestions(suggestions, filters, employees);
    filtered = sortSuggestions(filtered, sortField, sortDirection);
    setFilteredSuggestions(filtered);
  }, [suggestions, filters, sortField, sortDirection, employees]);

  const handleFilterChange = (newFilters: Partial<SuggestionFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleUpdateSuggestion = (updatedSuggestion: Suggestion) => {
    setSuggestions(prev =>
      prev.map(s => (s.id === updatedSuggestion.id ? updatedSuggestion : s))
    );
  };

  const handleOpenModal = (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSuggestion(null);
  };

  const handleOpenEmployeeDrawer = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDrawerOpen(true);
  };

  const handleCloseEmployeeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedEmployee(null);
  };

  const handleCreateSuggestion = (newSuggestion: Suggestion) => {
    setSuggestions(prev => [newSuggestion, ...prev]);
    setToast({
      message: 'Suggestion created successfully!',
      type: 'success',
      isVisible: true,
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee?.name || 'Unknown Employee';
  };

  const getStatusBadge = (suggestion: Suggestion) => {
    const isOverdueSuggestion = isOverdue(
      suggestion.dateCreated,
      suggestion.status
    );
    const statusClass = {
      pending:
        theme === 'dark'
          ? 'bg-yellow-900/20 text-yellow-300'
          : 'bg-yellow-100 text-yellow-800',
      in_progress:
        theme === 'dark'
          ? 'bg-blue-900/20 text-blue-300'
          : 'bg-blue-100 text-blue-800',
      completed:
        theme === 'dark'
          ? 'bg-green-900/20 text-green-300'
          : 'bg-green-100 text-green-800',
      dismissed:
        theme === 'dark'
          ? 'bg-red-900/20 text-red-300'
          : 'bg-red-100 text-red-800',
    };

    return (
      <div className="flex items-center space-x-2">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass[suggestion.status]}`}
        >
          {suggestion.status.replace('_', ' ')}
        </span>
        {isOverdueSuggestion && (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${theme === 'dark' ? 'bg-red-900/20 text-red-300' : 'bg-red-100 text-red-800'}`}
          >
            Overdue
          </span>
        )}
      </div>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityClass = {
      low:
        theme === 'dark'
          ? 'bg-gray-900/20 text-gray-300'
          : 'bg-gray-100 text-gray-800',
      medium:
        theme === 'dark'
          ? 'bg-yellow-900/20 text-yellow-300'
          : 'bg-yellow-100 text-yellow-800',
      high:
        theme === 'dark'
          ? 'bg-red-900/20 text-red-300'
          : 'bg-red-100 text-red-800',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityClass[priority as keyof typeof priorityClass]}`}
      >
        {priority}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeClass = {
      exercise:
        theme === 'dark'
          ? 'bg-green-900/20 text-green-300'
          : 'bg-green-100 text-green-800',
      equipment:
        theme === 'dark'
          ? 'bg-blue-900/20 text-blue-300'
          : 'bg-blue-100 text-blue-800',
      behavioural:
        theme === 'dark'
          ? 'bg-purple-900/20 text-purple-300'
          : 'bg-purple-100 text-purple-800',
      lifestyle:
        theme === 'dark'
          ? 'bg-orange-900/20 text-orange-300'
          : 'bg-orange-100 text-orange-800',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeClass[type as keyof typeof typeClass]}`}
      >
        {type}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div
        className={`${getThemeCardClasses(theme)} rounded-lg shadow-sm border ${getThemeBorderClasses(theme)} p-6`}
      >
        <div className="hidden md:block">
          <TableSkeleton />
        </div>
        <div className="md:hidden">
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`${getThemeCardClasses(theme)} rounded-lg shadow-sm border ${getThemeBorderClasses(theme)} p-6`}
      >
        <EmptyState
          title="Something went wrong"
          description={error}
          icon={
            <svg
              className="w-12 h-12 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          }
          action={
            <div className="space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Retry
              </button>
              <button
                onClick={() => {
                  setError(null);
                  setIsLoading(true);
                  // Retry loading data
                  const loadData = async () => {
                    try {
                      const [fetchedSuggestions, fetchedEmployees] =
                        await Promise.all([getSuggestions(), getEmployees()]);
                      setSuggestions(fetchedSuggestions);
                      setEmployees(fetchedEmployees);
                    } catch (err: unknown) {
                      const errorMessage =
                        err instanceof Error
                          ? err.message
                          : 'Failed to load data.';
                      setError(errorMessage);
                      console.error('Error loading data:', err);
                    } finally {
                      setIsLoading(false);
                    }
                  };
                  loadData();
                }}
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer"
              >
                Try Again
              </button>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      {/* Filters and Search */}
      <div
        className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-4`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label
              className={`block text-sm font-medium ${getThemeTextClasses(theme)} mb-1`}
            >
              Search All
            </label>
            <input
              type="text"
              placeholder="Search names, descriptions, status, priority..."
              value={filters.search || ''}
              onChange={e => handleFilterChange({ search: e.target.value })}
              className={`w-full px-3 py-2 border ${getThemeBorderClasses(theme)} rounded-md focus:ring-blue-500 focus:border-blue-500 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
            />
          </div>

          {/* Employee Filter */}
          <div>
            <label
              className={`block text-sm font-medium ${getThemeTextClasses(theme)} mb-1`}
            >
              Employee
            </label>
            <select
              value={filters.employee || ''}
              onChange={e =>
                handleFilterChange({ employee: e.target.value || undefined })
              }
              className={`w-full px-3 py-2 border ${getThemeBorderClasses(theme)} rounded-md focus:ring-blue-500 focus:border-blue-500 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
            >
              <option value="">All Employees</option>
              {employees.map(employee => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label
              className={`block text-sm font-medium ${getThemeTextClasses(theme)} mb-1`}
            >
              Status
            </label>
            <select
              value={filters.status || ''}
              onChange={e =>
                handleFilterChange({ status: e.target.value || undefined })
              }
              className={`w-full px-3 py-2 border ${getThemeBorderClasses(theme)} rounded-md focus:ring-blue-500 focus:border-blue-500 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label
              className={`block text-sm font-medium ${getThemeTextClasses(theme)} mb-1`}
            >
              Priority
            </label>
            <select
              value={filters.priority || ''}
              onChange={e =>
                handleFilterChange({ priority: e.target.value || undefined })
              }
              className={`w-full px-3 py-2 border ${getThemeBorderClasses(theme)} rounded-md focus:ring-blue-500 focus:border-blue-500 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center">
        <p
          className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-2 md:mb-0`}
        >
          Showing {filteredSuggestions.length} of {suggestions.length}{' '}
          suggestions
        </p>
        <div className="flex items-center space-x-3">
          {/* View Toggle Button */}
          <div
            className={`hidden md:flex items-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-1`}
          >
            <button
              onClick={() => setViewMode('table')}
              className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? theme === 'dark'
                    ? 'bg-gray-600 text-white shadow-sm'
                    : 'bg-white text-gray-900 shadow-sm'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <svg
                className="w-4 h-4 mr-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M3 14h18m-9-4v8m-7 4V4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1z"
                />
              </svg>
              Table
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? theme === 'dark'
                    ? 'bg-gray-600 text-white shadow-sm'
                    : 'bg-white text-gray-900 shadow-sm'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <svg
                className="w-4 h-4 mr-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              Grid
            </button>
          </div>

          <PermissionGuard permission="create_suggestions" admin={admin}>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-4 py-1.5 md:py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Suggestion
            </button>
          </PermissionGuard>
        </div>
      </div>

      {/* Desktop Table View */}
      {viewMode === 'table' && (
        <SuggestionTableData
          filteredSuggestions={filteredSuggestions}
          employees={employees}
          admin={admin}
          sortField={sortField}
          sortDirection={sortDirection}
          handleSort={handleSort}
          handleOpenEmployeeDrawer={handleOpenEmployeeDrawer}
          handleOpenModal={handleOpenModal}
          formatDate={formatDate}
          getRelativeTime={getRelativeTime}
          getEmployeeName={getEmployeeName}
          getTypeBadge={getTypeBadge}
          getStatusBadge={getStatusBadge}
          getPriorityBadge={getPriorityBadge}
        />
      )}

      {/* Desktop Grid View */}
      {viewMode === 'grid' && (
        <div className="hidden md:grid grid-cols-2 xl:grid-cols-3 gap-4 items-start">
          {filteredSuggestions.map(suggestion => {
            const employee = employees.find(
              emp => emp.id === suggestion.employeeId
            );
            if (!employee) return null;

            return (
              <div key={suggestion.id}>
                <SuggestionCard
                  suggestion={suggestion}
                  employeeName={employee.name}
                  admin={admin}
                  onUpdate={handleOpenModal}
                  showExpandButton={true}
                  onEmployeeClick={employeeId => {
                    const emp = employees.find(e => e.id === employeeId);
                    if (emp) handleOpenEmployeeDrawer(emp);
                  }}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredSuggestions.map(suggestion => {
          const employee = employees.find(
            emp => emp.id === suggestion.employeeId
          );
          if (!employee) return null;

          return (
            <SuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              employeeName={employee.name}
              admin={admin}
              onUpdate={handleOpenModal}
              showExpandButton={true}
              onEmployeeClick={employeeId => {
                const emp = employees.find(e => e.id === employeeId);
                if (emp) handleOpenEmployeeDrawer(emp);
              }}
            />
          );
        })}
      </div>

      {filteredSuggestions.length === 0 && (
        <EmptyState
          title={
            suggestions.length === 0
              ? 'No suggestions yet'
              : 'No matching suggestions'
          }
          description={
            suggestions.length === 0
              ? 'Get started by creating your first suggestion or seeding sample data.'
              : 'Try adjusting your filters to see more suggestions.'
          }
          icon={
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          }
          action={
            suggestions.length === 0 ? (
              <div className="space-x-3">
                <PermissionGuard permission="create_suggestions" admin={admin}>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Create First Suggestion
                  </button>
                </PermissionGuard>
              </div>
            ) : (
              <button
                onClick={() => setFilters({})}
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Clear Filters
              </button>
            )
          }
        />
      )}

      {/* Status Update Modal */}
      {selectedSuggestion && (
        <StatusUpdateModal
          suggestion={selectedSuggestion}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onUpdate={handleUpdateSuggestion}
        />
      )}

      {/* Employee Drawer */}
      <EmployeeDrawer
        employee={selectedEmployee}
        isOpen={isDrawerOpen}
        onClose={handleCloseEmployeeDrawer}
      />

      {/* Create Suggestion Modal */}
      <CreateSuggestionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuggestion}
        admin={admin}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}
