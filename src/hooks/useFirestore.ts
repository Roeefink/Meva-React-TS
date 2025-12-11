import { useState, useEffect } from 'react';
import { supabaseService } from '@/services/supabaseService';

export function useFirestore<T extends { id?: string }>(collectionName: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: result, error: fetchError } = await supabaseService.getAll<T>(collectionName);
      if (fetchError) throw new Error(fetchError.message);
      setData(result || []);
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
    const { data: newItem, error: addError } = await supabaseService.create(collectionName, item);
    if (addError) {
      console.error('Error adding item:', addError);
      throw new Error(addError.message);
    }
    if (newItem) {
      setData([...data, newItem]);
    }
  };

  const update = async (id: string, updates: Partial<T>) => {
    const { error: updateError } = await supabaseService.update(collectionName, id, updates);
    if (updateError) {
      console.error('Error updating item:', updateError);
      throw new Error(updateError.message);
    }
    await fetchData();
  };

  const remove = async (id: string) => {
    const { error: deleteError } = await supabaseService.delete(collectionName, id);
    if (deleteError) {
      console.error('Error deleting item:', deleteError);
      throw new Error(deleteError.message);
    }
    setData(data.filter((item: any) => item.id !== id));
  };

  return { data, loading, error, add, update, remove, refetch: fetchData };
}