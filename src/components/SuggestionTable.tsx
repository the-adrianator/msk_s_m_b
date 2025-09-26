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
import { formatCurrency } from '@/utils/currency';
import { AdminUser } from '@/types';
import PermissionGuard from './PermissionGuard';
import StatusUpdateModal from './StatusUpdateModal';
import SuggestionCard from './SuggestionCard';
import EmployeeDrawer from './EmployeeDrawer';
import CreateSuggestionModal from './CreateSuggestionModal';
import Toast from './Toast';

interface SuggestionTableProps {
  admin: AdminUser;
}

export default function SuggestionTable({ admin }: SuggestionTableProps) {
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
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
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
    let filtered = filterSuggestions(suggestions, filters);
    filtered = sortSuggestions(filtered, sortField, sortDirection);
    setFilteredSuggestions(filtered);
  }, [suggestions, filters, sortField, sortDirection]);

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

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, isVisible: true });
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
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      in_progress:
        'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      completed:
        'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      dismissed: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
    };

    return (
      <div className="flex items-center space-x-2">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass[suggestion.status]}`}
        >
          {suggestion.status.replace('_', ' ')}
        </span>
        {isOverdueSuggestion && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
            Overdue
          </span>
        )}
      </div>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityClass = {
      low: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
      medium:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      high: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
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
        'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      equipment:
        'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      behavioural:
        'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      lifestyle:
        'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 dark:text-red-400 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Search descriptions..."
              value={filters.search || ''}
              onChange={e => handleFilterChange({ search: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Employee Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Employee
            </label>
            <select
              value={filters.employee || ''}
              onChange={e =>
                handleFilterChange({ employee: e.target.value || undefined })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              value={filters.status || ''}
              onChange={e =>
                handleFilterChange({ status: e.target.value || undefined })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priority
            </label>
            <select
              value={filters.priority || ''}
              onChange={e =>
                handleFilterChange({ priority: e.target.value || undefined })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
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
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredSuggestions.length} of {suggestions.length}{' '}
          suggestions
        </p>
        <PermissionGuard permission="create_suggestions" admin={admin}>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Suggestion
          </button>
        </PermissionGuard>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleSort('dateUpdated')}
              >
                <div className="flex items-center space-x-1">
                  <span>Last Updated</span>
                  {sortField === 'dateUpdated' && (
                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  {sortField === 'status' && (
                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Source
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleSort('priority')}
              >
                <div className="flex items-center space-x-1">
                  <span>Priority</span>
                  {sortField === 'priority' && (
                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredSuggestions.map(suggestion => (
              <tr
                key={suggestion.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <div>
                    <div className="font-medium">
                      {formatDate(suggestion.dateUpdated)}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">
                      {getRelativeTime(suggestion.dateUpdated)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <button
                    onClick={() => {
                      const employee = employees.find(
                        emp => emp.id === suggestion.employeeId
                      );
                      if (employee) handleOpenEmployeeDrawer(employee);
                    }}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    {getEmployeeName(suggestion.employeeId)}
                  </button>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  <div
                    className="max-w-xs truncate"
                    title={suggestion.description}
                  >
                    {suggestion.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getTypeBadge(suggestion.type)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(suggestion)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <span className="capitalize">{suggestion.source}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getPriorityBadge(suggestion.priority)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <PermissionGuard permission="update_status" admin={admin}>
                    <button
                      onClick={() => handleOpenModal(suggestion)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Update
                    </button>
                  </PermissionGuard>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
              employee={employee}
              admin={admin}
              onUpdate={handleOpenModal}
            />
          );
        })}
      </div>

      {filteredSuggestions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No suggestions found matching your filters.
          </p>
        </div>
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
