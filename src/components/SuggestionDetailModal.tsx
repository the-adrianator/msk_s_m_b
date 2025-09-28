'use client';

import { Suggestion, AdminUser } from '@/types';
import { formatDate, getRelativeTime, isOverdue } from '@/utils/dates';
import { formatCurrency } from '@/utils/currency';
import PermissionGuard from './PermissionGuard';
import { useTheme } from '@/contexts/ThemeContext';
import {
  getThemeTextClasses,
  getThemeBorderClasses,
} from '@/utils/themeClasses';

interface SuggestionDetailModalProps {
  suggestion: Suggestion | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (suggestion: Suggestion) => void;
  admin: AdminUser;
  employeeName: string;
}

export default function SuggestionDetailModal({
  suggestion,
  isOpen,
  onClose,
  onUpdate,
  admin,
  employeeName,
}: SuggestionDetailModalProps) {
  const { theme } = useTheme();
  if (!isOpen || !suggestion) return null;

  const getStatusBadge = (suggestion: Suggestion) => {
    const isOverdueSuggestion = isOverdue(
      suggestion.dateCreated,
      suggestion.status
    );
    let colorClass = '';
    let text = '';

    switch (suggestion.status) {
      case 'pending':
        colorClass =
          theme === 'dark'
            ? 'bg-yellow-900/20 text-yellow-300'
            : 'bg-yellow-100 text-yellow-800';
        text = 'Pending';
        break;
      case 'in_progress':
        colorClass =
          theme === 'dark'
            ? 'bg-blue-900/20 text-blue-300'
            : 'bg-blue-100 text-blue-800';
        text = 'In Progress';
        break;
      case 'completed':
        colorClass =
          theme === 'dark'
            ? 'bg-green-900/20 text-green-300'
            : 'bg-green-100 text-green-800';
        text = 'Completed';
        break;
      default:
        colorClass =
          theme === 'dark'
            ? 'bg-gray-900/20 text-gray-300'
            : 'bg-gray-100 text-gray-800';
        text = 'Unknown';
    }

    if (isOverdueSuggestion && suggestion.status !== 'completed') {
      colorClass =
        theme === 'dark'
          ? 'bg-red-900/20 text-red-300'
          : 'bg-red-100 text-red-800';
      text = 'Overdue';
    }

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
      >
        {text}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    let colorClass = '';
    switch (priority) {
      case 'low':
        colorClass =
          theme === 'dark'
            ? 'bg-green-900/20 text-green-300'
            : 'bg-green-100 text-green-800';
        break;
      case 'medium':
        colorClass =
          theme === 'dark'
            ? 'bg-yellow-900/20 text-yellow-300'
            : 'bg-yellow-100 text-yellow-800';
        break;
      case 'high':
        colorClass =
          theme === 'dark'
            ? 'bg-red-900/20 text-red-300'
            : 'bg-red-100 text-red-800';
        break;
      default:
        colorClass =
          theme === 'dark'
            ? 'bg-gray-900/20 text-gray-300'
            : 'bg-gray-100 text-gray-800';
    }
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
      >
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    let colorClass = '';
    switch (type) {
      case 'exercise':
        colorClass =
          theme === 'dark'
            ? 'bg-blue-900/20 text-blue-300'
            : 'bg-blue-100 text-blue-800';
        break;
      case 'equipment':
        colorClass =
          theme === 'dark'
            ? 'bg-purple-900/20 text-purple-300'
            : 'bg-purple-100 text-purple-800';
        break;
      case 'behavioural':
        colorClass =
          theme === 'dark'
            ? 'bg-green-900/20 text-green-300'
            : 'bg-green-100 text-green-800';
        break;
      case 'lifestyle':
        colorClass =
          theme === 'dark'
            ? 'bg-pink-900/20 text-pink-300'
            : 'bg-pink-100 text-pink-800';
        break;
      default:
        colorClass =
          theme === 'dark'
            ? 'bg-gray-900/20 text-gray-300'
            : 'bg-gray-100 text-gray-800';
    }
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div
        className={`relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-2xl rounded-lg ${theme === 'dark' ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-md ${theme === 'dark' ? 'border-gray-700/50' : 'border-white/20'}`}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b ${getThemeBorderClasses(theme)}`}>
          <div className="flex items-center justify-between">
            <h2
              className={`text-xl font-semibold ${getThemeTextClasses(theme)}`}
            >
              Suggestion Details
            </h2>
            <button
              onClick={onClose}
              className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1 cursor-pointer`}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-6">
          {/* Employee and Description */}
          <div>
            <h3
              className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-2`}
            >
              Employee
            </h3>
            <p
              className={`text-lg font-medium ${getThemeTextClasses(theme)} mb-4`}
            >
              {employeeName}
            </p>

            <h3
              className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-2`}
            >
              Description
            </h3>
            <p className={getThemeTextClasses(theme)}>
              {suggestion.description}
            </p>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-3">
            {getTypeBadge(suggestion.type)}
            {getStatusBadge(suggestion)}
            {getPriorityBadge(suggestion.priority)}
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${theme === 'dark' ? 'bg-gray-900/20 text-gray-300' : 'bg-gray-100 text-gray-800'}`}
            >
              {suggestion.source}
            </span>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3
                className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1`}
              >
                Created
              </h3>
              <p className={`text-sm ${getThemeTextClasses(theme)}`}>
                {formatDate(suggestion.dateCreated)}
              </p>
            </div>
            <div>
              <h3
                className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1`}
              >
                Last Updated
              </h3>
              <p className={`text-sm ${getThemeTextClasses(theme)}`}>
                {formatDate(suggestion.dateUpdated)} (
                {getRelativeTime(suggestion.dateUpdated)})
              </p>
            </div>
            {suggestion.dateCompleted && (
              <div>
                <h3
                  className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1`}
                >
                  Completed
                </h3>
                <p className={`text-sm ${getThemeTextClasses(theme)}`}>
                  {formatDate(suggestion.dateCompleted)}
                </p>
              </div>
            )}
            {suggestion.estimatedCost && (
              <div>
                <h3
                  className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1`}
                >
                  Estimated Cost
                </h3>
                <p className={`text-sm ${getThemeTextClasses(theme)}`}>
                  {formatCurrency(suggestion.estimatedCost)}
                </p>
              </div>
            )}
          </div>

          {/* Notes */}
          {suggestion.notes && (
            <div>
              <h3
                className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-2`}
              >
                Notes
              </h3>
              <p
                className={`text-sm ${getThemeTextClasses(theme)} ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} p-3 rounded-md`}
              >
                {suggestion.notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className={`px-4 py-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-300 bg-gray-600 border-gray-500 hover:bg-gray-500' : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'} border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer`}
            >
              Close
            </button>
            <PermissionGuard permission="update_status" admin={admin}>
              <button
                onClick={() => {
                  onUpdate(suggestion);
                  onClose();
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                Update Status
              </button>
            </PermissionGuard>
          </div>
        </div>
      </div>
    </div>
  );
}
