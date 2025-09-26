import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Suggestion, CreateSuggestionData, UpdateSuggestionData } from '@/types';

const COLLECTION_NAME = 'suggestions';

/**
 * Get all suggestions
 * @returns Promise<Suggestion[]> - Array of all suggestions
 */
export async function getSuggestions(): Promise<Suggestion[]> {
  try {
    const suggestionsRef = collection(db, COLLECTION_NAME);
    const q = query(suggestionsRef, orderBy('dateUpdated', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore timestamps to ISO strings
      dateCreated: doc.data().dateCreated?.toDate?.()?.toISOString() || doc.data().dateCreated,
      dateUpdated: doc.data().dateUpdated?.toDate?.()?.toISOString() || doc.data().dateUpdated,
      dateCompleted: doc.data().dateCompleted?.toDate?.()?.toISOString() || doc.data().dateCompleted,
    })) as Suggestion[];
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    throw new Error('Failed to fetch suggestions');
  }
}

/**
 * Get suggestion by ID
 * @param suggestionId - Suggestion ID
 * @returns Promise<Suggestion | null> - Suggestion data or null if not found
 */
export async function getSuggestionById(suggestionId: string): Promise<Suggestion | null> {
  try {
    const suggestionRef = doc(db, COLLECTION_NAME, suggestionId);
    const suggestionSnap = await getDoc(suggestionRef);
    
    if (suggestionSnap.exists()) {
      const data = suggestionSnap.data();
      return {
        id: suggestionSnap.id,
        ...data,
        // Convert Firestore timestamps to ISO strings
        dateCreated: data.dateCreated?.toDate?.()?.toISOString() || data.dateCreated,
        dateUpdated: data.dateUpdated?.toDate?.()?.toISOString() || data.dateUpdated,
        dateCompleted: data.dateCompleted?.toDate?.()?.toISOString() || data.dateCompleted,
      } as Suggestion;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching suggestion:', error);
    throw new Error('Failed to fetch suggestion');
  }
}

/**
 * Get suggestions by employee ID
 * @param employeeId - Employee ID
 * @returns Promise<Suggestion[]> - Array of suggestions for employee
 */
export async function getSuggestionsByEmployee(employeeId: string): Promise<Suggestion[]> {
  try {
    const suggestionsRef = collection(db, COLLECTION_NAME);
    const q = query(
      suggestionsRef,
      where('employeeId', '==', employeeId),
      orderBy('dateUpdated', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore timestamps to ISO strings
      dateCreated: doc.data().dateCreated?.toDate?.()?.toISOString() || doc.data().dateCreated,
      dateUpdated: doc.data().dateUpdated?.toDate?.()?.toISOString() || doc.data().dateUpdated,
      dateCompleted: doc.data().dateCompleted?.toDate?.()?.toISOString() || doc.data().dateCompleted,
    })) as Suggestion[];
  } catch (error) {
    console.error('Error fetching suggestions by employee:', error);
    throw new Error('Failed to fetch suggestions by employee');
  }
}

/**
 * Create a new suggestion
 * @param suggestionData - Suggestion data
 * @param createdBy - Email of admin creating the suggestion
 * @returns Promise<string> - ID of created suggestion
 */
export async function createSuggestion(
  suggestionData: CreateSuggestionData,
  createdBy: string
): Promise<string> {
  try {
    const now = new Date().toISOString();
    
    const suggestionRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(suggestionRef, {
      ...suggestionData,
      status: 'pending',
      source: 'admin',
      createdBy,
      dateCreated: Timestamp.fromDate(new Date(now)),
      dateUpdated: Timestamp.fromDate(new Date(now)),
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating suggestion:', error);
    throw new Error('Failed to create suggestion');
  }
}

/**
 * Update suggestion status and other fields
 * @param suggestionId - Suggestion ID
 * @param updateData - Data to update
 * @returns Promise<void>
 */
export async function updateSuggestion(
  suggestionId: string,
  updateData: UpdateSuggestionData
): Promise<void> {
  try {
    const suggestionRef = doc(db, COLLECTION_NAME, suggestionId);
    const now = new Date().toISOString();
    
    const updateFields: any = {
      ...updateData,
      dateUpdated: Timestamp.fromDate(new Date(now)),
    };
    
    // If status is being set to completed, set dateCompleted
    if (updateData.status === 'completed') {
      updateFields.dateCompleted = Timestamp.fromDate(new Date(now));
    }
    
    await updateDoc(suggestionRef, updateFields);
  } catch (error) {
    console.error('Error updating suggestion:', error);
    throw new Error('Failed to update suggestion');
  }
}

/**
 * Delete a suggestion
 * @param suggestionId - Suggestion ID
 * @returns Promise<void>
 */
export async function deleteSuggestion(suggestionId: string): Promise<void> {
  try {
    const suggestionRef = doc(db, COLLECTION_NAME, suggestionId);
    await deleteDoc(suggestionRef);
  } catch (error) {
    console.error('Error deleting suggestion:', error);
    throw new Error('Failed to delete suggestion');
  }
}

/**
 * Get suggestions by status
 * @param status - Status to filter by
 * @returns Promise<Suggestion[]> - Array of suggestions with specified status
 */
export async function getSuggestionsByStatus(
  status: 'pending' | 'in_progress' | 'completed' | 'dismissed'
): Promise<Suggestion[]> {
  try {
    const suggestionsRef = collection(db, COLLECTION_NAME);
    const q = query(
      suggestionsRef,
      where('status', '==', status),
      orderBy('dateUpdated', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore timestamps to ISO strings
      dateCreated: doc.data().dateCreated?.toDate?.()?.toISOString() || doc.data().dateCreated,
      dateUpdated: doc.data().dateUpdated?.toDate?.()?.toISOString() || doc.data().dateUpdated,
      dateCompleted: doc.data().dateCompleted?.toDate?.()?.toISOString() || doc.data().dateCompleted,
    })) as Suggestion[];
  } catch (error) {
    console.error('Error fetching suggestions by status:', error);
    throw new Error('Failed to fetch suggestions by status');
  }
}
