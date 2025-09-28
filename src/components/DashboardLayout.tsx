'use client';

import { useState } from 'react';
import { AdminUser } from '@/types';
import Header from './Header';
import Sidebar from './Sidebar';
import { usePathname } from 'next/navigation';

interface DashboardLayoutProps {
  admin: AdminUser;
  children: React.ReactNode;
}

export default function DashboardLayout({
  admin,
  children,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Desktop Sidebar - Hidden on mobile, visible on desktop */}
      <aside className="hidden lg:block fixed left-0 top-0 h-full w-64 z-30">
        <Sidebar currentPath={pathname} />
      </aside>

      {/* Mobile Sidebar - Slides in from left */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar currentPath={pathname} onClose={closeMobileSidebar} />
      </aside>

      {/* Main content area with responsive margin */}
      <div className="flex flex-col flex-grow lg:ml-64 overflow-x-hidden">
        <Header admin={admin} onToggleMobileSidebar={toggleMobileSidebar} />
        <main className="flex-grow py-4 sm:py-6 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
          <div className="w-full overflow-x-hidden">{children}</div>
        </main>
      </div>
    </div>
  );
}
