<!-- src/routes/auth/update-password/+page.svelte -->
<script lang="ts">
    import { supabase } from '$lib/supabase';
    import { goto } from '$app/navigation';
    import { Loader, Lock } from 'lucide-svelte';
    import { redirect } from '@sveltejs/kit';
    import type { PageLoad } from './$types';

    export const load: PageLoad = async ({ parent }) => {
        const { session } = await parent();
        
        // Redirect to login if not authenticated
        if (!session) {
            throw redirect(303, '/auth/login');
        }

        return {};
    };
  
    let password = '';
    let confirmPassword = '';
    let loading = false;
    let message = { text: '', type: '' };
  
    async function handlePasswordUpdate() {
        if (password !== confirmPassword) {
            message = {
                text: 'Passwords do not match',
                type: 'error'
            };
            return;
        }

        if (password.length < 6) {
            message = {
                text: 'Password must be at least 6 characters long',
                type: 'error'
            };
            return;
        }
  
        try {
            loading = true;
            message = { text: '', type: '' };
  
            const { error } = await supabase.auth.updateUser({
                password: password
            });
  
            if (error) throw error;
  
            message = {
                text: 'Password updated successfully! Redirecting...',
                type: 'success'
            };

            // Clear form
            password = '';
            confirmPassword = '';

            // Redirect after a short delay
            setTimeout(() => {
                goto('/dashboard');
            }, 2000);
            
        } catch (error) {
            message = {
                text: error.message || 'Failed to update password',
                type: 'error'
            };
        } finally {
            loading = false;
        }
    }
</script>
  
<div class="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-md">
    <h1 class="text-2xl font-bold text-purple-900 mb-6">Update Your Password</h1>
    
    <p class="text-gray-600 mb-6">
        Please enter your new password below.
    </p>
  
    <form on:submit|preventDefault={handlePasswordUpdate} class="space-y-4">
        <!-- New Password -->
        <div>
            <label for="password" class="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <Lock size={20} />
                New Password
            </label>
            <input
                type="password"
                id="password"
                bind:value={password}
                required
                minlength="6"
                disabled={loading}
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="Enter your new password"
            />
        </div>
  
        <!-- Confirm Password -->
        <div>
            <label for="confirm-password" class="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <Lock size={20} />
                Confirm New Password
            </label>
            <input
                type="password"
                id="confirm-password"
                bind:value={confirmPassword}
                required
                minlength="6"
                disabled={loading}
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="Confirm your new password"
            />
        </div>
  
        {#if message.text}
            <div class={`p-4 rounded-md ${
                message.type === 'error' 
                    ? 'bg-red-50 text-red-700' 
                    : 'bg-green-50 text-green-700'
            }`}>
                {message.text}
            </div>
        {/if}
  
        <button
            type="submit"
            disabled={loading}
            class="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center gap-2"
        >
            {#if loading}
                <Loader class="animate-spin" size={20} />
                <span>Updating...</span>
            {:else}
                <span>Update Password</span>
            {/if}
        </button>
  
        <div class="text-center mt-4">
            <a 
                href="/auth/login" 
                class="text-purple-600 hover:text-purple-500"
            >
                Back to Login
            </a>
        </div>
    </form>
</div>