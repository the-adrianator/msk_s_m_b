'use client';

import { ReactNode } from 'react';
import { AdminUser } from '@/types';
import { hasPermission } from '@/services/authService';

interface PermissionGuardProps {
  children: ReactNode;
  permission: string;
  admin: AdminUser;
  fallback?: ReactNode;
}

export default function PermissionGuard({
  children,
  permission,
  admin: _admin,
  fallback = null,
}: PermissionGuardProps) {
  const hasRequiredPermission = hasPermission(permission);

  if (!hasRequiredPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Convenience components for common permissions
export function CreateSuggestionGuard({
  children,
  admin,
  fallback,
}: Omit<PermissionGuardProps, 'permission'>) {
  return (
    <PermissionGuard
      permission="create_suggestions"
      admin={admin}
      fallback={fallback}
    >
      {children}
    </PermissionGuard>
  );
}

export function UpdateStatusGuard({
  children,
  admin,
  fallback,
}: Omit<PermissionGuardProps, 'permission'>) {
  return (
    <PermissionGuard
      permission="update_status"
      admin={admin}
      fallback={fallback}
    >
      {children}
    </PermissionGuard>
  );
}

export function ViewAllGuard({
  children,
  admin,
  fallback,
}: Omit<PermissionGuardProps, 'permission'>) {
  return (
    <PermissionGuard permission="view_all" admin={admin} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}
