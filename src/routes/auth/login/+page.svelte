<script lang="ts">
    import { supabase } from '$lib/supabase';
    import { goto } from '$app/navigation';
    import { Loader } from 'lucide-svelte';
    
    let email = '';
    let password = '';
    let loading = false;
    let errorMsg = '';

    async function handleLogin() {
        try {
            loading = true;
            errorMsg = '';
            
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            await goto('/dashboard');
            
        } catch (error) {
            errorMsg = error.message || 'Failed to login';
            console.error('Login error:', error);
        } finally {
            loading = false;
        }
    }
</script>

<div class="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-md">
    <h1 class="text-2xl font-bold text-purple-900 mb-6">Welcome back to DreamScape</h1>

    <form on:submit|preventDefault={handleLogin} class="space-y-4">
        {#if errorMsg}
            <div class="text-red-500 text-sm">
                {errorMsg}
            </div>
        {/if}

        <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
                Email
            </label>
            <input 
                type="email" 
                id="email" 
                bind:value={email} 
                disabled={loading}
                required 
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
        </div>

        <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
                Password
            </label>
            <input 
                type="password" 
                id="password" 
                bind:value={password} 
                disabled={loading}
                required 
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
        </div>

        <button 
            type="submit" 
            disabled={loading}
            class="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
        >
            {#if loading}
                <Loader class="inline animate-spin" size={20} />
                <span class="ml-2">Logging in...</span>
            {:else}
                <span>Log In</span>
            {/if}
        </button>

        <div class="flex flex-col space-y-2 text-center text-sm">
            <a 
                href="/auth/signup" 
                class="text-purple-600 hover:text-purple-500"
            >
                Don't have an account? Register here
            </a>
            <a 
                href="/auth/reset-password" 
                class="text-purple-600 hover:text-purple-500"
            >
                Forgot your password?
            </a>
        </div>
    </form>
</div>