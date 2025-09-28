'use client';

import { Suggestion, AdminUser } from '@/types';
import { formatDate, getRelativeTime, isOverdue } from '@/utils/dates';
import { formatCurrency } from '@/utils/currency';
import PermissionGuard from './PermissionGuard';

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
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
        text = 'Pending';
        break;
      case 'in_progress':
        colorClass =
          'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
        text = 'In Progress';
        break;
      case 'completed':
        colorClass =
          'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
        text = 'Completed';
        break;
      default:
        colorClass =
          'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
        text = 'Unknown';
    }

    if (isOverdueSuggestion && suggestion.status !== 'completed') {
      colorClass =
        'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
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
          'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
        break;
      case 'medium':
        colorClass =
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
        break;
      case 'high':
        colorClass =
          'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
        break;
      default:
        colorClass =
          'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
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
          'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
        break;
      case 'equipment':
        colorClass =
          'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
        break;
      case 'behavioural':
        colorClass =
          'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
        break;
      case 'lifestyle':
        colorClass =
          'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300';
        break;
      default:
        colorClass =
          'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
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
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-2xl rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-white/20 dark:border-gray-700/50">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Suggestion Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
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
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Employee
            </h3>
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {employeeName}
            </p>

            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Description
            </h3>
            <p className="text-gray-900 dark:text-white">
              {suggestion.description}
            </p>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-3">
            {getTypeBadge(suggestion.type)}
            {getStatusBadge(suggestion)}
            {getPriorityBadge(suggestion.priority)}
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300">
              {suggestion.source}
            </span>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Created
              </h3>
              <p className="text-sm text-gray-900 dark:text-white">
                {formatDate(suggestion.dateCreated)}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Last Updated
              </h3>
              <p className="text-sm text-gray-900 dark:text-white">
                {formatDate(suggestion.dateUpdated)} (
                {getRelativeTime(suggestion.dateUpdated)})
              </p>
            </div>
            {suggestion.dateCompleted && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Completed
                </h3>
                <p className="text-sm text-gray-900 dark:text-white">
                  {formatDate(suggestion.dateCompleted)}
                </p>
              </div>
            )}
            {suggestion.estimatedCost && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Estimated Cost
                </h3>
                <p className="text-sm text-gray-900 dark:text-white">
                  {formatCurrency(suggestion.estimatedCost)}
                </p>
              </div>
            )}
          </div>

          {/* Notes */}
          {suggestion.notes && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Notes
              </h3>
              <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
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
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Close
            </button>
            <PermissionGuard permission="update_status" admin={admin}>
              <button
                onClick={() => {
                  onUpdate(suggestion);
                  onClose();
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
