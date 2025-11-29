import { useState, useEffect } from 'react';
import { firestoreService } from '@/services/firebaseService';
import type { DocumentData } from 'firebase/firestore';

export function useFirestore<T extends DocumentData>(collectionName: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await firestoreService.getAll<T>(collectionName);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [collectionName]);

  const add = async (item: T) => {
    const newItem = await firestoreService.create(collectionName, item);
    setData([...data, newItem as T]);
  };

  const update = async (id: string, updates: Partial<T>) => {
    await firestoreService.update(collectionName, id, updates);
    await fetchData();
  };

  const remove = async (id: string) => {
    await firestoreService.delete(collectionName, id);
    setData(data.filter((item: any) => item.id !== id));
  };

  return { data, loading, error, add, update, remove, refetch: fetchData };
}