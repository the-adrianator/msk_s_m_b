'use client';

import { useState } from 'react';
import { Suggestion, UpdateSuggestionData } from '@/types';
import { updateSuggestion } from '@/services/suggestionService';

interface StatusUpdateModalProps {
  suggestion: Suggestion;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedSuggestion: Suggestion) => void;
}

export default function StatusUpdateModal({
  suggestion,
  isOpen,
  onClose,
  onUpdate,
}: StatusUpdateModalProps) {
  const [status, setStatus] = useState(suggestion.status);
  const [notes, setNotes] = useState(suggestion.notes || '');
  const [estimatedCost, setEstimatedCost] = useState(
    suggestion.estimatedCost || ''
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setError(null);

    try {
      const updateData: UpdateSuggestionData = {
        status,
        notes: notes || undefined,
        estimatedCost: estimatedCost || undefined,
      };

      await updateSuggestion(suggestion.id, updateData);

      // Create updated suggestion object
      const updatedSuggestion: Suggestion = {
        ...suggestion,
        ...updateData,
        dateUpdated: new Date().toISOString(),
        dateCompleted:
          status === 'completed'
            ? new Date().toISOString()
            : suggestion.dateCompleted,
      };

      onUpdate(updatedSuggestion);
      onClose();
    } catch (err) {
      setError('Failed to update suggestion. Please try again.');
      console.error('Error updating suggestion:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDismiss = async () => {
    if (status === 'dismissed') {
      const confirmed = window.confirm(
        'Are you sure you want to dismiss this suggestion? This action cannot be undone.'
      );
      if (!confirmed) return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const updateData: UpdateSuggestionData = {
        status,
        notes: notes || undefined,
        estimatedCost: estimatedCost || undefined,
      };

      await updateSuggestion(suggestion.id, updateData);
      onUpdate(suggestion);
      onClose();
    } catch (err) {
      setError('Failed to update suggestion. Please try again.');
      console.error('Error updating suggestion:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Update Suggestion Status
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Status Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={e =>
                  setStatus(
                    e.target.value as
                      | 'pending'
                      | 'in_progress'
                      | 'completed'
                      | 'dismissed'
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="dismissed">Dismissed</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Add any additional notes..."
              />
            </div>

            {/* Estimated Cost */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Estimated Cost
              </label>
              <input
                type="text"
                value={estimatedCost}
                onChange={e => setEstimatedCost(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., £85.00"
              />
            </div>

            {error && (
              <div className="text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                disabled={isUpdating}
              >
                Cancel
              </button>

              {status === 'dismissed' ? (
                <button
                  type="button"
                  onClick={handleDismiss}
                  disabled={isUpdating}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {isUpdating ? 'Dismissing...' : 'Dismiss Suggestion'}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isUpdating ? 'Updating...' : 'Update Status'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
