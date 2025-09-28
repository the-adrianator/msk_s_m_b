'use client';

import { useState } from 'react';
import { Suggestion } from '@/types';
import { getRelativeTime, isOverdue } from '@/utils/dates';
import { formatCurrency } from '@/utils/currency';
import { AdminUser } from '@/types';
import PermissionGuard from './PermissionGuard';

interface SuggestionCardProps {
  suggestion: Suggestion;
  employeeName: string;
  admin: AdminUser;
  onUpdate: (suggestion: Suggestion) => void;
  isExpanded?: boolean;
  showExpandButton?: boolean;
  onEmployeeClick?: (employeeId: string) => void;
}

export default function SuggestionCard({
  suggestion,
  employeeName,
  admin,
  onUpdate,
  isExpanded = false,
  showExpandButton = false,
  onEmployeeClick,
}: SuggestionCardProps) {
  const [isCardExpanded, setIsCardExpanded] = useState(isExpanded);
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow min-h-[160px]">
      {/* Header with employee info and status */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          {onEmployeeClick ? (
            <button
              onClick={() => onEmployeeClick(suggestion.employeeId)}
              className="font-medium text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-left transition-colors duration-200"
            >
              {employeeName}
            </button>
          ) : (
            <h3 className="font-medium text-gray-900 dark:text-white">
              {employeeName}
            </h3>
          )}
          {isCardExpanded && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Employee • Department
            </p>
          )}
        </div>
        <div className="ml-4 flex items-center space-x-2">
          {getStatusBadge(suggestion)}
          {showExpandButton && (
            <button
              onClick={() => setIsCardExpanded(!isCardExpanded)}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label={isCardExpanded ? 'Collapse card' : 'Expand card'}
            >
              {isCardExpanded ? (
                <svg
                  className="w-4 h-4"
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
              ) : (
                <svg
                  className="w-4 h-4"
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
              )}
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mb-3">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {suggestion.description}
        </p>
      </div>

      {/* Badges row */}
      <div className="flex flex-wrap gap-2 mb-3">
        {getTypeBadge(suggestion.type)}
        {getPriorityBadge(suggestion.priority)}
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300">
          {suggestion.source}
        </span>
      </div>

      {/* Expanded content - only show when isCardExpanded is true */}
      {isCardExpanded && (
        <>
          {/* Additional info */}
          <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex justify-between">
              <span>Last updated:</span>
              <span>{getRelativeTime(suggestion.dateUpdated)}</span>
            </div>
            {suggestion.estimatedCost && (
              <div className="flex justify-between">
                <span>Estimated cost:</span>
                <span>{formatCurrency(suggestion.estimatedCost)}</span>
              </div>
            )}
            {suggestion.notes && (
              <div>
                <span className="font-medium">Notes:</span>
                <p className="mt-1 text-gray-600 dark:text-gray-300">
                  {suggestion.notes}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <PermissionGuard permission="update_status" admin={admin}>
              <button
                onClick={() => onUpdate(suggestion)}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
              >
                Update Status
              </button>
            </PermissionGuard>
          </div>
        </>
      )}
    </div>
  );
}
