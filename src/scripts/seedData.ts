import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Employee, Suggestion } from '@/types';
import expandedSampleData from '../../expanded_sample_data.json';

/**
 * Seed Firestore with expanded sample data
 */
export async function seedFirestoreData(): Promise<void> {
  try {
    console.log('Starting to seed Firestore with expanded sample data...');

    // Add employees from expanded data
    const employeeIds: string[] = [];
    for (const employee of expandedSampleData.employees) {
      const docRef = await addDoc(collection(db, 'employees'), {
        name: employee.name,
        department: employee.department,
        riskLevel: employee.riskLevel,
        jobTitle: employee.jobTitle,
        workstation: employee.workstation,
        lastAssessment: employee.lastAssessment,
      });
      employeeIds.push(docRef.id);
      console.log(`Added employee: ${employee.name} (ID: ${docRef.id})`);
    }

    // Create a mapping from original employee IDs to new Firestore IDs
    const employeeIdMap = new Map<string, string>();
    expandedSampleData.employees.forEach((employee, index) => {
      employeeIdMap.set(employee.id, employeeIds[index]);
    });

    // Add suggestions from expanded data
    for (const suggestion of expandedSampleData.suggestions) {
      // Map the employee ID to the new Firestore ID
      const newEmployeeId = employeeIdMap.get(suggestion.employeeId);
      if (!newEmployeeId) {
        console.warn(
          `Employee ID ${suggestion.employeeId} not found, skipping suggestion`
        );
        continue;
      }

        // Build the document data, only including fields that have values
        const suggestionData: any = {
          employeeId: newEmployeeId,
          type: suggestion.type,
          description: suggestion.description,
          status: suggestion.status,
          priority: suggestion.priority,
          source: suggestion.source,
          createdBy: suggestion.createdBy || 'vida-system@company.com',
          dateCreated: Timestamp.fromDate(new Date(suggestion.dateCreated)),
          dateUpdated: Timestamp.fromDate(new Date(suggestion.dateUpdated)),
        };

        // Only add optional fields if they have values
        if (suggestion.dateCompleted) {
          suggestionData.dateCompleted = Timestamp.fromDate(new Date(suggestion.dateCompleted));
        }
        if (suggestion.notes) {
          suggestionData.notes = suggestion.notes;
        }
        if (suggestion.estimatedCost) {
          suggestionData.estimatedCost = suggestion.estimatedCost;
        }

        const docRef = await addDoc(collection(db, 'suggestions'), suggestionData);

      console.log(
        `Added suggestion: ${suggestion.description.substring(0, 50)}... (ID: ${docRef.id})`
      );
    }

    console.log('Firestore data seeding completed successfully!');
    console.log(
      `Added ${expandedSampleData.employees.length} employees and ${expandedSampleData.suggestions.length} suggestions`
    );
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
    console.log(
      'Data clearing not implemented - use Firebase console to clear data manually'
    );
  } catch (error) {
    console.error('Error clearing Firestore data:', error);
    throw error;
  }
}
