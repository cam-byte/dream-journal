<!-- src/routes/profile/+page.svelte -->
<script lang="ts">
    import { supabase } from '$lib/supabase';
    import { User, Mail, Save, Loader } from 'lucide-svelte';
    import { goto } from '$app/navigation';
    
    let profile = {
        name: '',
        email: '',
        created_at: null,
        updated_at: null
    };
    let loading = true;
    let saving = false;
    let message = { text: '', type: '' };

    async function loadProfile() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            await goto('/auth/login');
            return;
        }

        const { data, error } = await supabase
            .from('user_profiles')
            .select('name, email, updated_at')
            .eq('id', user.id)
            .maybeSingle();

        if (error) throw error;

        profile = {
            name: data?.name || '',
            email: user.email || '',  // Use auth user email as fallback
            created_at: user.created_at,
            updated_at: data?.updated_at || null
        };
    } catch (error) {
        console.error('Load error:', error);
        message = { text: error.message || 'Error loading profile', type: 'error' };
    } finally {
        loading = false;
    }
}

    async function handleSignOut() {
        try {
            await supabase.auth.signOut();
            goto('/auth/login');
        } catch (error) {
            console.error('Sign out error:', error);
        }
    }

    async function updateProfile() {
    try {
        saving = true;
        message = { text: '', type: '' };

        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) throw new Error('No user found');

        const updateData = {
            id: user.id,  // Make sure to include the id
            name: profile.name,
            updated_at: new Date().toISOString()
        };

        const { error } = await supabase
            .from('user_profiles')
            .upsert(updateData, {
                onConflict: 'id',
                returning: 'minimal' // Don't return the result
            });

        if (error) throw error;

        message = { text: 'Profile updated successfully!', type: 'success' };
        await loadProfile(); // Reload profile data
    } catch (error) {
        console.error('Update error:', error);
        message = { text: error.message || 'Failed to update profile', type: 'error' };
    } finally {
        saving = false;
    }
}
    // Handle password reset
    async function resetPassword() {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(profile.email);
            if (error) throw error;
            message = { text: 'Password reset email sent!', type: 'success' };
        } catch (error) {
            message = { text: error.message, type: 'error' };
        }
    }

    loadProfile();
</script>

<div class="container mx-auto px-4 py-8 max-w-2xl !mt-8">
    <div class="bg-white rounded-lg shadow-sm border">
        <div class="p-6 border-b">
            <h1 class="text-2xl font-bold">Profile Settings</h1>
        </div>

        {#if loading}
            <div class="p-6 text-center text-gray-500">
                <Loader class="animate-spin inline-block" />
                Loading profile...
            </div>
        {:else}
            <form on:submit|preventDefault={updateProfile} class="p-6 space-y-6">
                {#if message.text}
                    <div class={`p-4 rounded-md ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                        {message.text}
                    </div>
                {/if}

                <!-- Name Field -->
                <div class="space-y-2">
                    <label for="name" class="block font-medium text-gray-700 flex items-center gap-2">
                        <User size={20} />
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        bind:value={profile.name}
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Enter your name"
                    />
                </div>

                <!-- Email Field (read-only) -->
                <div class="space-y-2">
                    <label for="email" class="block font-medium text-gray-700 flex items-center gap-2">
                        <Mail size={20} />
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={profile.email}
                        readonly
                        class="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm text-gray-500"
                    />
                </div>

                <!-- Save Button -->
                <button
                    type="submit"
                    disabled={saving}
                    class="w-full flex items-center justify-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-purple-400 disabled:cursor-not-allowed transition-colors"
                >
                    {#if saving}
                        <Loader class="animate-spin" />
                        Saving...
                    {:else}
                        <Save size={20} />
                        Save Changes
                    {/if}
                </button>
            </form>

            <!-- Additional Actions -->
            <div class="border-t p-6">
                <h2 class="text-lg font-medium mb-4">Account Actions</h2>
                
                <!-- Password Reset -->
                <button
                    on:click={goto('/auth/reset-password')}
                    class="text-blue-600 hover:text-blue-500 hover:underline"
                >
                    Reset Password
                </button>
            </div>
        {/if}
    </div>

    <!-- Template stays mostly the same, just update the dates section -->
<div class="mt-8 bg-white rounded-lg shadow-sm border p-6">
    <h2 class="text-lg font-medium mb-4">Account Statistics</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <p class="text-gray-600">Member Since</p>
            <p class="text-lg font-medium">
                {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
            </p>
        </div>
        <div>
            <p class="text-gray-600">Last Updated</p>
            <p class="text-lg font-medium">
                {profile.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'N/A'}
            </p>
        </div>
    </div>
</div>

    <!-- Sign Out Button -->
    <div class="mt-8 text-center">
        <button
            on:click={handleSignOut}
            class="text-red-600 hover:text-red-500 hover:underline"
        >
            Sign Out
        </button>
    </div>
</div>