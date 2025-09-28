import React, { useState } from 'react';
import { Suggestion, Employee, AdminUser, SortField } from '@/types';
import PermissionGuard from './PermissionGuard';
import SuggestionDetailModal from './SuggestionDetailModal';
import { useTheme } from '@/contexts/ThemeContext';
import {
  getThemeTextClasses,
  getThemeBorderClasses,
} from '@/utils/themeClasses';

interface SuggestionTableDataProps {
  filteredSuggestions: Suggestion[];
  employees: Employee[];
  admin: AdminUser;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  handleSort: (field: SortField) => void;
  handleOpenEmployeeDrawer: (employee: Employee) => void;
  handleOpenModal: (suggestion: Suggestion) => void;
  formatDate: (date: string) => string;
  getRelativeTime: (date: string) => string;
  getEmployeeName: (employeeId: string) => string;
  getTypeBadge: (type: string) => React.ReactNode;
  getStatusBadge: (suggestion: Suggestion) => React.ReactNode;
  getPriorityBadge: (priority: string) => React.ReactNode;
}

const SuggestionTableData = ({
  filteredSuggestions,
  employees,
  admin,
  sortField,
  sortDirection,
  handleSort,
  handleOpenEmployeeDrawer,
  handleOpenModal,
  formatDate,
  getRelativeTime,
  getEmployeeName,
  getTypeBadge,
  getStatusBadge,
  getPriorityBadge,
}: SuggestionTableDataProps) => {
  const { theme } = useTheme();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<Suggestion | null>(null);

  const handleOpenDetailModal = (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedSuggestion(null);
  };

  const handleUpdateFromDetail = (suggestion: Suggestion) => {
    handleOpenModal(suggestion);
  };

  return (
    <div className="hidden md:block w-full">
      <div
        className={`border ${getThemeBorderClasses(theme)} rounded-lg overflow-hidden`}
      >
        <div className="overflow-x-auto" style={{ maxHeight: '600px' }}>
          <table
            className={`min-w-full divide-y ${getThemeBorderClasses(theme)}`}
            style={{ minWidth: '1200px' }}
          >
            <thead
              className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} sticky top-0 z-30`}
            >
              <tr>
                {/* First column - Last Updated */}
                <th
                  className={`pl-4 pr-[41px] py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider cursor-pointer ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} w-64 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}
                  onClick={() => handleSort('dateUpdated')}
                  style={{ position: 'sticky', left: '0px', zIndex: 20 }}
                >
                  <div className="flex items-center space-x-1">
                    <span>Last Updated</span>
                    {sortField === 'dateUpdated' && (
                      <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>

                {/* Second column - Employee */}
                <th
                  className={`px-4 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider w-32 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}
                  style={{ position: 'sticky', left: '128px', zIndex: 20 }}
                >
                  Employee
                </th>

                {/* Scrollable columns */}
                <th
                  className={`pl-8 pr-4 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider w-64`}
                >
                  Description
                </th>
                <th
                  className={`px-4 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider w-24`}
                >
                  Category
                </th>
                <th
                  className={`px-4 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider cursor-pointer ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} w-24`}
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    {sortField === 'status' && (
                      <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th
                  className={`px-4 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider w-20`}
                >
                  Source
                </th>
                <th
                  className={`px-4 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider cursor-pointer ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} w-20`}
                  onClick={() => handleSort('priority')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Priority</span>
                    {sortField === 'priority' && (
                      <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th
                  className={`px-4 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider w-24`}
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody
              className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} divide-y ${getThemeBorderClasses(theme)}`}
            >
              {filteredSuggestions.map((suggestion, index) => (
                <tr
                  key={suggestion.id}
                  className={`${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} ${
                    index % 2 === 0
                      ? theme === 'dark'
                        ? 'bg-gray-900'
                        : 'bg-white'
                      : theme === 'dark'
                        ? 'bg-gray-800'
                        : 'bg-gray-50'
                  }`}
                >
                  {/* First column - Last Updated */}
                  <td
                    className={`px-4 py-4 whitespace-nowrap text-sm ${getThemeTextClasses(theme)} w-32 bg-inherit`}
                    style={{ position: 'sticky', left: '0px', zIndex: 20 }}
                  >
                    <div>
                      <div className="font-medium">
                        {formatDate(suggestion.dateUpdated)}
                      </div>
                      <div
                        className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs`}
                      >
                        {getRelativeTime(suggestion.dateUpdated)}
                      </div>
                    </div>
                  </td>

                  {/* Second column - Employee */}
                  <td
                    className={`px-4 py-4 whitespace-nowrap text-sm ${getThemeTextClasses(theme)} w-32 bg-inherit`}
                    style={{ position: 'sticky', left: '128px', zIndex: 20 }}
                  >
                    <button
                      onClick={() => {
                        const employee = employees.find(
                          emp => emp.id === suggestion.employeeId
                        );
                        if (employee) handleOpenEmployeeDrawer(employee);
                      }}
                      className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-900'} font-medium transition-colors duration-200 cursor-pointer`}
                    >
                      {getEmployeeName(suggestion.employeeId)}
                    </button>
                  </td>

                  {/* Scrollable columns */}
                  <td
                    className={`pl-8 pr-4 py-4 text-sm ${getThemeTextClasses(theme)} w-64`}
                  >
                    <button
                      onClick={() => handleOpenDetailModal(suggestion)}
                      className={`text-left w-full truncate ${theme === 'dark' ? 'hover:text-blue-400' : 'hover:text-blue-600'} transition-colors duration-200 cursor-pointer`}
                      title={suggestion.description}
                    >
                      {suggestion.description}
                    </button>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap w-24">
                    {getTypeBadge(suggestion.type)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap w-24">
                    {getStatusBadge(suggestion)}
                  </td>
                  <td
                    className={`px-4 py-4 whitespace-nowrap text-sm ${getThemeTextClasses(theme)} w-20`}
                  >
                    <span className="capitalize">{suggestion.source}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap w-20">
                    {getPriorityBadge(suggestion.priority)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium w-24">
                    <PermissionGuard permission="update_status" admin={admin}>
                      <button
                        onClick={() => handleOpenModal(suggestion)}
                        className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-900'} transition-colors duration-200 cursor-pointer`}
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
      </div>

      {/* Suggestion Detail Modal */}
      <SuggestionDetailModal
        suggestion={selectedSuggestion}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        onUpdate={handleUpdateFromDetail}
        admin={admin}
        employeeName={
          selectedSuggestion
            ? getEmployeeName(selectedSuggestion.employeeId)
            : ''
        }
      />
    </div>
  );
};

export default SuggestionTableData;
