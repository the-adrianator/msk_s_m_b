import { Suggestion, SuggestionFilters } from '@/types';

/**
 * Filter suggestions based on provided filters
 * @param suggestions - Array of suggestions to filter
 * @param filters - Filter criteria
 * @param employees - Array of employees for name lookup
 * @returns Filtered array of suggestions
 */
export function filterSuggestions(
  suggestions: Suggestion[],
  filters: SuggestionFilters,
  employees?: Array<{ id: string; name: string }>
): Suggestion[] {
  return suggestions.filter(suggestion => {
    // Employee filter
    if (filters.employee && suggestion.employeeId !== filters.employee) {
      return false;
    }

    // Category/Type filter
    if (filters.category && suggestion.type !== filters.category) {
      return false;
    }

    // Status filter
    if (filters.status && suggestion.status !== filters.status) {
      return false;
    }

    // Source filter
    if (filters.source && suggestion.source !== filters.source) {
      return false;
    }

    // Priority filter
    if (filters.priority && suggestion.priority !== filters.priority) {
      return false;
    }

    // Free-text search across multiple fields
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const employee = employees?.find(emp => emp.id === suggestion.employeeId);
      const employeeName = employee?.name || '';

      const searchableFields = [
        suggestion.description,
        suggestion.type,
        suggestion.status,
        suggestion.priority,
        suggestion.source,
        employeeName,
        suggestion.notes || '',
        suggestion.estimatedCost || '',
      ];

      const searchableText = searchableFields.join(' ').toLowerCase();
      if (!searchableText.includes(searchTerm)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sort suggestions based on field and direction
 * @param suggestions - Array of suggestions to sort
 * @param field - Field to sort by
 * @param direction - Sort direction
 * @returns Sorted array of suggestions
 */
export function sortSuggestions(
  suggestions: Suggestion[],
  field: 'dateUpdated' | 'priority' | 'status',
  direction: 'asc' | 'desc'
): Suggestion[] {
  return [...suggestions].sort((a, b) => {
    let comparison = 0;

    switch (field) {
      case 'dateUpdated':
        comparison =
          new Date(a.dateUpdated).getTime() - new Date(b.dateUpdated).getTime();
        break;
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      case 'status':
        const statusOrder = {
          pending: 1,
          in_progress: 2,
          completed: 3,
          dismissed: 4,
        };
        comparison = statusOrder[a.status] - statusOrder[b.status];
        break;
    }

    return direction === 'desc' ? -comparison : comparison;
  });
}
