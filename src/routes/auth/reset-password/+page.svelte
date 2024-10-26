<script lang="ts">
    import { supabase } from '$lib/supabase';
    import { goto } from '$app/navigation';
    import { Loader } from 'lucide-svelte';
  
    let email = '';
    let loading = false;
    let message = { text: '', type: '' };
  
    async function handleResetPassword() {
        try {
            loading = true;
            message = { text: '', type: '' };
  
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${location.origin}/auth/update-password`,
            });
  
            if (error) throw error;
  
            message = {
                text: 'Password reset instructions sent to your email!',
                type: 'success'
            };
  
        } catch (error) {
            message = {
                text: error.message || 'Failed to send reset instructions',
                type: 'error'
            };
        } finally {
            loading = false;
        }
    }
</script>
  
<div class="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-md">
    <h1 class="text-2xl font-bold text-purple-900 mb-6">Reset Your Password</h1>
    
    <p class="text-gray-600 mb-6">
        Enter your email address and we'll send you instructions to reset your password.
    </p>
  
    <form on:submit|preventDefault={handleResetPassword} class="space-y-4">
        <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
                Email
            </label>
            <input
                type="email"
                id="email"
                bind:value={email}
                required
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
                placeholder="Enter your email address"
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
                <span>Sending...</span>
            {:else}
                <span>Send Reset Instructions</span>
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