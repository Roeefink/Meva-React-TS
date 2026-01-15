import { supabase } from '@/config/Supabase';
import { PostgrestError } from '@supabase/supabase-js';

// Define a generic type for the ID
type BaseEntity = {
    id?: string;
    [key: string]: any;
};

export const supabaseService = {
    // Create
    async create<T extends BaseEntity>(table: string, data: T): Promise<{ data: T | null; error: PostgrestError | null }> {
        const { data: createdData, error } = await supabase
            .from(table)
            .insert(data)
            .select()
            .single();

        if (error) {
            console.error(`Error creating in ${table}:`, error);
        }

        return { data: createdData as T, error };
    },

    // Read all
    async getAll<T>(table: string): Promise<{ data: T[] | null; error: PostgrestError | null }> {
        const { data, error } = await supabase
            .from(table)
            .select('*');

        if (error) {
            console.error(`Error getting all from ${table}:`, error);
        }

        return { data: data as T[], error };
    },

    // Read one by ID
    async getById<T>(table: string, id: string): Promise<{ data: T | null; error: PostgrestError | null }> {
        const { data, error } = await supabase
            .from(table)
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error(`Error getting by id from ${table}:`, error);
        }

        return { data: data as T, error };
    },

    // Update
    async update<T>(table: string, id: string, updates: Partial<T>): Promise<{ data: T | null; error: PostgrestError | null }> {
        const { data, error } = await supabase
            .from(table)
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error(`Error updating in ${table}:`, error);
        }

        return { data: data as T, error };
    },

    // Delete
    async delete(table: string, id: string): Promise<{ error: PostgrestError | null }> {
        const { error } = await supabase
            .from(table)
            .delete()
            .eq('id', id);

        if (error) {
            console.error(`Error deleting from ${table}:`, error);
        }

        return { error };
    },

    // Custom Query
    async query<T>(table: string, queryFn: (query: any) => any): Promise<{ data: T[] | null; error: PostgrestError | null }> {
        const { data, error } = await queryFn(supabase.from(table).select('*'));
        if (error) {
            console.error(`Error querying ${table}:`, error);
        }
        return { data: data as T[], error };
    }
};
