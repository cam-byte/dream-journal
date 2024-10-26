<script lang="ts">
    import { supabase } from '$lib/supabase';
    import { goto } from '$app/navigation';
    import { Loader } from 'lucide-svelte';
  
    let email = '';
    let password = '';
    let confirmPassword = '';
    let loading = false;
    let error = '';
  
    async function handleSignup() {
      if (password !== confirmPassword) {
        error = 'Passwords do not match';
        return;
      }
  
      loading = true;
      error = '';
  
      try {
        const { data, error: signupError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${location.origin}/auth/callback`
          }
        });
  
        if (signupError) throw signupError;
  
        if (data) {
          goto('/auth/verify-email');
        }
      } catch (e) {
        error = e.message;
      } finally {
        loading = false;
      }
    }
  </script>
  
  <div class="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-md">
    <h1 class="text-2xl font-bold text-purple-900 mb-6">Create your DreamScape Account</h1>
  
    <form on:submit|preventDefault={handleSignup} class="space-y-4">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          bind:value={email}
          required
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
        />
      </div>
  
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          id="password"
          bind:value={password}
          required
          minlength="6"
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
        />
      </div>
  
      <div>
        <label for="confirm-password" class="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirm-password"
          bind:value={confirmPassword}
          required
          minlength="6"
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
        />
      </div>
  
      {#if error}
        <div class="text-red-500 text-sm">{error}</div>
      {/if}
  
      <button
        type="submit"
        disabled={loading}
        class="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {#if loading}
          <Loader class="inline animate-spin" size={20} />
          Creating account...
        {:else}
          Sign Up
        {/if}
      </button>
    </form>
  
    <p class="mt-4 text-center text-sm text-gray-600">
      Already have an account?
      <a href="/auth/login" class="text-purple-600 hover:text-purple-500">Log in</a>
    </p>
  </div>