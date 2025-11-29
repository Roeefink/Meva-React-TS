import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  QueryConstraint
} from 'firebase/firestore';
import type { DocumentData, WithFieldValue } from 'firebase/firestore';
import { db } from '@/config/Firebase';

// Generic CRUD operations
export const firestoreService = {
  // Create
  async create<T extends DocumentData>(collectionName: string, data: WithFieldValue<T>) {
    try {
      const docRef = await addDoc(collection(db, collectionName), data);
      return { id: docRef.id, ...data } as T & { id: string };
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  },

  // Read all
  async getAll<T>(collectionName: string): Promise<T[]> {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as T));
    } catch (error) {
      console.error('Error getting documents:', error);
      throw error;
    }
  },

  // Read one
  async getById<T>(collectionName: string, id: string): Promise<T | null> {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      }
      return null;
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  },

  // Update
  async update<T extends DocumentData>(collectionName: string, id: string, data: Partial<WithFieldValue<T>>) {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, data as Partial<DocumentData>);
      return { id, ...data };
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  },

  // Delete
  async delete(collectionName: string, id: string) {
    try {
      await deleteDoc(doc(db, collectionName, id));
      return id;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  },

  // Query with conditions
  async query<T>(
    collectionName: string, 
    ...queryConstraints: QueryConstraint[]
  ): Promise<T[]> {
    try {
      const q = query(collection(db, collectionName), ...queryConstraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as T));
    } catch (error) {
      console.error('Error querying documents:', error);
      throw error;
    }
  }
};