'use client';

import React from 'react';
import Link from 'next/link';
import { HomeIcon, ListBulletIcon } from '@heroicons/react/24/outline';

interface SidebarProps {
  currentPath: string;
  onClose?: () => void;
}

export default function Sidebar({ currentPath, onClose }: SidebarProps) {
  const navItems = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Suggestions', href: '/suggestions', icon: ListBulletIcon },
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex-grow p-4">
        <div className="flex items-center justify-between mb-8">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            MSK Board
          </div>
          {/* Mobile close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close sidebar"
            >
              <svg
                className="h-6 w-6"
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
          )}
        </div>
        <nav className="space-y-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPath === item.href;
            return (
              <Link key={item.name} href={item.href} passHref>
                <div
                  onClick={onClose}
                  className={`flex items-center p-3 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        MSK Suggestion Management Board v1.0
      </div>
    </div>
  );
}
