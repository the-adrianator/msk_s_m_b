import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Employee, Suggestion } from '@/types';

// Sample employees data
const sampleEmployees: Omit<Employee, 'id'>[] = [
  {
    name: 'Sarah Johnson',
    department: 'IT',
    riskLevel: 'high',
    jobTitle: 'Software Developer',
    workstation: 'Desk-001',
    lastAssessment: '2024-01-15T10:30:00.000Z',
  },
  {
    name: 'Michael Chen',
    department: 'Finance',
    riskLevel: 'medium',
    jobTitle: 'Financial Analyst',
    workstation: 'Desk-002',
    lastAssessment: '2024-01-20T14:15:00.000Z',
  },
  {
    name: 'Emma Wilson',
    department: 'HR',
    riskLevel: 'low',
    jobTitle: 'HR Manager',
    workstation: 'Desk-003',
    lastAssessment: '2024-01-10T09:00:00.000Z',
  },
  {
    name: 'David Brown',
    department: 'Operations',
    riskLevel: 'high',
    jobTitle: 'Operations Manager',
    workstation: 'Desk-004',
    lastAssessment: '2024-01-25T11:45:00.000Z',
  },
  {
    name: 'Lisa Garcia',
    department: 'Marketing',
    riskLevel: 'medium',
    jobTitle: 'Marketing Specialist',
    workstation: 'Desk-005',
    lastAssessment: '2024-01-18T16:20:00.000Z',
  },
];

// Sample suggestions data
const sampleSuggestions: Omit<Suggestion, 'id'>[] = [
  {
    employeeId: '', // Will be set after employees are created
    type: 'exercise',
    description: 'Take regular breaks every 30 minutes to stretch and walk around',
    status: 'pending',
    priority: 'high',
    source: 'vida',
    createdBy: 'vida-system',
    dateCreated: '2024-01-15T10:30:00.000Z',
    dateUpdated: '2024-01-15T10:30:00.000Z',
    notes: 'Recommended by VIDA assessment',
  },
  {
    employeeId: '', // Will be set after employees are created
    type: 'equipment',
    description: 'Adjust monitor height to eye level to reduce neck strain',
    status: 'in_progress',
    priority: 'medium',
    source: 'vida',
    createdBy: 'vida-system',
    dateCreated: '2024-01-20T14:15:00.000Z',
    dateUpdated: '2024-01-22T09:30:00.000Z',
    notes: 'Equipment ordered, awaiting delivery',
  },
  {
    employeeId: '', // Will be set after employees are created
    type: 'behavioural',
    description: 'Practice proper lifting techniques when moving office supplies',
    status: 'completed',
    priority: 'low',
    source: 'admin',
    createdBy: 'hsmanager@company.com',
    dateCreated: '2024-01-10T09:00:00.000Z',
    dateUpdated: '2024-01-12T15:45:00.000Z',
    dateCompleted: '2024-01-12T15:45:00.000Z',
    notes: 'Training completed successfully',
  },
  {
    employeeId: '', // Will be set after employees are created
    type: 'lifestyle',
    description: 'Incorporate desk exercises into daily routine',
    status: 'pending',
    priority: 'medium',
    source: 'admin',
    createdBy: 'hsmanager@company.com',
    dateCreated: '2024-01-25T11:45:00.000Z',
    dateUpdated: '2024-01-25T11:45:00.000Z',
    estimatedCost: '£0.00',
  },
  {
    employeeId: '', // Will be set after employees are created
    type: 'equipment',
    description: 'Install ergonomic keyboard and mouse for better wrist support',
    status: 'dismissed',
    priority: 'low',
    source: 'vida',
    createdBy: 'vida-system',
    dateCreated: '2024-01-18T16:20:00.000Z',
    dateUpdated: '2024-01-20T10:15:00.000Z',
    notes: 'Not applicable for current workstation setup',
  },
];

/**
 * Seed Firestore with sample data
 */
export async function seedFirestoreData(): Promise<void> {
  try {
    console.log('Starting to seed Firestore data...');
    
    // Add employees
    const employeeIds: string[] = [];
    for (const employee of sampleEmployees) {
      const docRef = await addDoc(collection(db, 'employees'), employee);
      employeeIds.push(docRef.id);
      console.log(`Added employee: ${employee.name} (ID: ${docRef.id})`);
    }
    
    // Add suggestions with employee IDs
    for (let i = 0; i < sampleSuggestions.length; i++) {
      const suggestion = {
        ...sampleSuggestions[i],
        employeeId: employeeIds[i % employeeIds.length], // Distribute suggestions across employees
      };
      
      const docRef = await addDoc(collection(db, 'suggestions'), {
        ...suggestion,
        dateCreated: Timestamp.fromDate(new Date(suggestion.dateCreated)),
        dateUpdated: Timestamp.fromDate(new Date(suggestion.dateUpdated)),
        dateCompleted: suggestion.dateCompleted 
          ? Timestamp.fromDate(new Date(suggestion.dateCompleted))
          : undefined,
      });
      
      console.log(`Added suggestion: ${suggestion.description} (ID: ${docRef.id})`);
    }
    
    console.log('Firestore data seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding Firestore data:', error);
    throw error;
  }
}

/**
 * Clear all data from Firestore (use with caution!)
 */
export async function clearFirestoreData(): Promise<void> {
  try {
    console.log('Clearing Firestore data...');
    
    // Note: In a real application, you'd want to implement proper batch deletion
    // For now, this is just a placeholder
    console.log('Data clearing not implemented - use Firebase console to clear data manually');
  } catch (error) {
    console.error('Error clearing Firestore data:', error);
    throw error;
  }
}
