// src/lib/stores/auth.ts
import { writable } from 'svelte/store';
import { supabase } from '$lib/supabase';

export const authStore = writable(null);

// Initialize store with current session
supabase.auth.getSession().then(({ data: { session } }) => {
    authStore.set(session?.user || null);
});

// Update store on auth state changes
supabase.auth.onAuthStateChange((event, session) => {
    authStore.set(session?.user || null);
});