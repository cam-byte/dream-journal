<!-- src/routes/dashboard/+page.svelte -->
<script lang="ts">
    import { supabase } from '$lib/supabase';
    import { Book, Moon, Star, Calendar, TrendingUp, PlusCircle, LogOut } from 'lucide-svelte';
    import { goto } from '$app/navigation';
    import { redirect } from '@sveltejs/kit';
    import type { PageLoad } from './$types';

    export const load: PageLoad = async ({ parent }) => {
        const { session } = await parent();
        
        if (!session) {
            throw redirect(303, '/auth/login');
        }

        return {
            session
        };
    };
    
    let recentDreams = [];
    let stats = {
        totalDreams: 0,
        thisMonth: 0,
        lucidCount: 0,
        mostCommonMood: ''
    };
    let loading = true;
    let error = null;

    async function loadDashboardData() {
        try {
            // Load recent dreams with tags and mood
            const { data: dreams, error: dreamsError } = await supabase
                .from('dreams')
                .select(`
                    id,
                    title,
                    description,
                    created_at,
                    tags,
                    mood,
                    is_lucid,
                    image_url
                `)
                .order('created_at', { ascending: false })
                .limit(5);

            if (dreamsError) throw dreamsError;
            recentDreams = dreams;

            // Load all dreams for stats
            const { data: allDreams, error: statsError } = await supabase
                .from('dreams')
                .select('created_at, mood, is_lucid');

            if (statsError) throw statsError;

            const now = new Date();
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

            // Calculate mood frequency
            const moodCounts = allDreams.reduce((acc, dream) => {
                if (dream.mood) {
                    acc[dream.mood] = (acc[dream.mood] || 0) + 1;
                }
                return acc;
            }, {});

            const mostCommonMood = Object.entries(moodCounts)
                .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';

            stats = {
                totalDreams: allDreams.length,
                thisMonth: allDreams.filter(dream => 
                    new Date(dream.created_at) >= firstDayOfMonth
                ).length,
                lucidCount: allDreams.filter(dream => dream.is_lucid).length,
                mostCommonMood
            };

        } catch (e) {
            error = e.message;
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

    loadDashboardData();
</script>

<div class="container mx-auto px-4 py-8 !mt-8">
    <h1 class="text-3xl font-bold mb-8">Dream Journal Dashboard</h1>

    <!-- Quick Actions -->
    <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4">Quick Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a 
                href="/dreams/new" 
                class="flex items-center gap-3 p-4 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors"
            >
                <PlusCircle class="text-purple-600" />
                <span class="font-medium">Record New Dream</span>
            </a>
            <a 
                href="/dreams" 
                class="flex items-center gap-3 p-4 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
            >
                <Book class="text-blue-600" />
                <span class="font-medium">View Dream Journal</span>
            </a>
            <a 
                href="/profile" 
                class="flex items-center gap-3 p-4 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
            >
                <Star class="text-green-600" />
                <span class="font-medium">Profile Settings</span>
            </a>
            <button 
                on:click={handleSignOut}
                class="flex items-center gap-3 p-4 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
            >
                <LogOut class="text-red-600" />
                <span class="font-medium">Sign Out</span>
            </button>
        </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow-sm border">
            <div class="flex items-center gap-3 mb-3">
                <Book class="text-purple-600" />
                <h3 class="font-medium text-gray-600">Total Dreams</h3>
            </div>
            <p class="text-3xl font-bold">
                {loading ? '...' : stats.totalDreams}
            </p>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border">
            <div class="flex items-center gap-3 mb-3">
                <Calendar class="text-blue-600" />
                <h3 class="font-medium text-gray-600">This Month</h3>
            </div>
            <p class="text-3xl font-bold">
                {loading ? '...' : stats.thisMonth}
            </p>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border">
            <div class="flex items-center gap-3 mb-3">
                <Moon class="text-green-600" />
                <h3 class="font-medium text-gray-600">Lucid Dreams</h3>
            </div>
            <p class="text-3xl font-bold">
                {loading ? '...' : stats.lucidCount}
            </p>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border">
            <div class="flex items-center gap-3 mb-3">
                <Star class="text-yellow-600" />
                <h3 class="font-medium text-gray-600">Common Mood</h3>
            </div>
            <p class="text-3xl font-bold capitalize">
                {loading ? '...' : stats.mostCommonMood}
            </p>
        </div>
    </div>

    <!-- Recent Dreams -->
    <div class="bg-white rounded-lg shadow-sm border">
        <div class="p-6 border-b">
            <h2 class="text-xl font-semibold">Recent Dreams</h2>
        </div>
        
        {#if loading}
            <div class="p-6 text-center text-gray-500">Loading...</div>
        {:else if error}
            <div class="p-6 text-center text-red-500">{error}</div>
        {:else if recentDreams.length === 0}
            <div class="p-6 text-center text-gray-500">
                No dreams recorded yet. 
                <a href="/dreams/new" class="text-purple-600 hover:underline">Record your first dream</a>
            </div>
        {:else}
            <div class="divide-y">
                {#each recentDreams as dream}
                    <a 
                        href="/dreams/{dream.id}" 
                        class="block p-6 hover:bg-gray-50 transition-colors"
                    >
                        <div class="flex gap-4">
                            {#if dream.image_url}
                                <img 
                                    src={dream.image_url} 
                                    alt="Dream visualization" 
                                    class="w-20 h-20 object-cover rounded"
                                />
                            {/if}
                            <div class="flex-1">
                                <h3 class="font-medium mb-2">{dream.title}</h3>
                                <p class="text-gray-600 text-sm line-clamp-2">{dream.description}</p>
                                <div class="mt-2 flex gap-4 text-sm">
                                    <span class="text-gray-500">
                                        {new Date(dream.created_at).toLocaleDateString()}
                                    </span>
                                    {#if dream.mood}
                                        <span class="text-purple-600 capitalize">
                                            {dream.mood}
                                        </span>
                                    {/if}
                                    {#if dream.is_lucid}
                                        <span class="text-blue-600">
                                            Lucid
                                        </span>
                                    {/if}
                                </div>
                                {#if dream.tags && dream.tags.length > 0}
                                    <div class="mt-2 flex gap-2 flex-wrap">
                                        {#each dream.tags as tag}
                                            <span class="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                                                {tag}
                                            </span>
                                        {/each}
                                    </div>
                                {/if}
                            </div>
                        </div>
                    </a>
                {/each}
            </div>
        {/if}
        
        {#if recentDreams.length > 0}
            <div class="p-4 border-t">
                <a 
                    href="/dreams" 
                    class="text-purple-600 hover:underline text-sm"
                >
                    View all dreams →
                </a>
            </div>
        {/if}
    </div>
</div>