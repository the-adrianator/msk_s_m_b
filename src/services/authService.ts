import { AdminUser } from '@/types';

// Mock admin users - in a real app, this would come from Firestore
const MOCK_ADMINS: AdminUser[] = [
  {
    email: 'hsmanager@company.com',
    name: 'Alex Thompson',
    role: 'Health & Safety Manager',
    permissions: ['create_suggestions', 'update_status', 'view_all'],
  },
  {
    email: 'admin@company.com',
    name: 'Admin User',
    role: 'Administrator',
    permissions: ['create_suggestions', 'update_status', 'view_all'],
  },
  {
    email: 'viewer@company.com',
    name: 'Viewer User',
    role: 'Viewer',
    permissions: ['view_all'],
  },
];

/**
 * Mock authentication - validates email and password
 * @param email - User email
 * @param password - User password (any password works in mock)
 * @returns Promise<AdminUser | null> - Admin user if valid, null if invalid
 */
export async function mockSignIn(email: string, password: string): Promise<AdminUser | null> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Find admin by email (password validation is mocked)
  const admin = MOCK_ADMINS.find(a => a.email === email);
  
  if (admin) {
    // Store session in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminSession', JSON.stringify({
        user: admin,
        timestamp: Date.now(),
      }));
    }
    
    return admin;
  }
  
  return null;
}

/**
 * Get current admin session
 * @returns AdminUser | null - Current admin or null if not authenticated
 */
export function getCurrentAdmin(): AdminUser | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    const session = localStorage.getItem('adminSession');
    if (!session) {
      return null;
    }
    
    const { user, timestamp } = JSON.parse(session);
    
    // Check if session is still valid (24 hours)
    const sessionAge = Date.now() - timestamp;
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    if (sessionAge > maxAge) {
      localStorage.removeItem('adminSession');
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Error getting current admin:', error);
    return null;
  }
}

/**
 * Sign out current admin
 */
export function signOut(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminSession');
  }
}

/**
 * Check if admin has specific permission
 * @param permission - Permission to check
 * @returns boolean - True if admin has permission
 */
export function hasPermission(permission: string): boolean {
  const admin = getCurrentAdmin();
  return admin?.permissions.includes(permission) || false;
}

/**
 * Check if admin can create suggestions
 * @returns boolean - True if admin can create suggestions
 */
export function canCreateSuggestions(): boolean {
  return hasPermission('create_suggestions');
}

/**
 * Check if admin can update status
 * @returns boolean - True if admin can update status
 */
export function canUpdateStatus(): boolean {
  return hasPermission('update_status');
}

/**
 * Check if admin can view all data
 * @returns boolean - True if admin can view all data
 */
export function canViewAll(): boolean {
  return hasPermission('view_all');
}
