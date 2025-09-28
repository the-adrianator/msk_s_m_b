'use client';

import { useState, useEffect, useCallback } from 'react';
import { Employee, Suggestion } from '@/types';
import { getSuggestionsByEmployee } from '@/services/suggestionService';
import { formatDate } from '@/utils/dates';
import { formatCurrency } from '@/utils/currency';

interface EmployeeDrawerProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EmployeeDrawer({
  employee,
  isOpen,
  onClose,
}: EmployeeDrawerProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadEmployeeSuggestions = useCallback(async () => {
    if (!employee) return;

    setIsLoading(true);
    try {
      const employeeSuggestions = await getSuggestionsByEmployee(employee.id);
      setSuggestions(employeeSuggestions);
    } catch (error) {
      console.error('Error loading employee suggestions:', error);
      // Set empty array on error to show "No suggestions found" message
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [employee]);

  useEffect(() => {
    if (employee && isOpen) {
      loadEmployeeSuggestions();
    }
  }, [employee, isOpen, loadEmployeeSuggestions]);

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return 'text-red-600 dark:text-red-400';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'low':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusBadge = (status: string) => {
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
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusClass[status as keyof typeof statusClass]}`}
      >
        {status.replace('_', ' ')}
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
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${typeClass[type as keyof typeof typeClass]}`}
      >
        {type}
      </span>
    );
  };

  if (!employee) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-xl z-50 transform transition-transform duration-300 ease-in-out border-l border-white/20 dark:border-gray-700/50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Employee Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Employee Info */}
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-lg">
                    {employee.name
                      .split(' ')
                      .map(n => n[0])
                      .join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {employee.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {employee.jobTitle}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Department:
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {employee.department}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Workstation:
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {employee.workstation}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Risk Level:
                  </span>
                  <span
                    className={`text-sm font-medium ${getRiskLevelColor(employee.riskLevel)}`}
                  >
                    {employee.riskLevel.toUpperCase()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Last Assessment:
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {formatDate(employee.lastAssessment)}
                  </span>
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div>
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                Suggestions ({suggestions.length})
              </h4>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : suggestions.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No suggestions found for this employee.
                </p>
              ) : (
                <div className="space-y-3">
                  {suggestions.map(suggestion => (
                    <div
                      key={suggestion.id}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 dark:text-white font-medium">
                            {suggestion.description}
                          </p>
                        </div>
                        <div className="ml-2">
                          {getStatusBadge(suggestion.status)}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-2">
                        {getTypeBadge(suggestion.type)}
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200">
                          {suggestion.priority}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200">
                          {suggestion.source}
                        </span>
                      </div>

                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex justify-between">
                          <span>Updated:</span>
                          <span>{formatDate(suggestion.dateUpdated)}</span>
                        </div>
                        {suggestion.estimatedCost && (
                          <div className="flex justify-between">
                            <span>Cost:</span>
                            <span>
                              {formatCurrency(suggestion.estimatedCost)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
