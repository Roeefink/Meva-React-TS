import { supabase } from '@/config/Supabase';
import { AuthError, type Session, type User } from '@supabase/supabase-js';

export const authService = {
    // Sign Up
    async signUp(email: string, password: string) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        return { data, error };
    },

    // Sign In
    async signIn(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { data, error };
    },

    // Sign Out
    async signOut() {
        const { error } = await supabase.auth.signOut();
        return { error };
    },

    // Reset Password
    async resetPassword(email: string) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/reset-password', // Adjust as needed
        });
        return { error };
    },

    // Get Current User
    async getCurrentUser() {
        const { data: { user } } = await supabase.auth.getUser()
        return user;
    },

    // Get Session
    async getSession() {
        const { data: { session } } = await supabase.auth.getSession();
        return session;
    }
};

export type { User, Session, AuthError };
