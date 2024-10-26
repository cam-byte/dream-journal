<script lang="ts">
  import { Moon, Search } from 'lucide-svelte';
  import { supabase } from '$lib/supabase';
  import { onMount } from 'svelte';

  let dreams = [];
  let loading = true;
  let error = '';
  let searchQuery = '';

  async function loadDreams() {
    try {
      const { data, error: fetchError } = await supabase
        .from('dreams')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      dreams = data;
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadDreams();
  });

  $: filteredDreams = dreams.filter(dream => 
    dream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dream.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
</script>

<div class="container mx-auto px-4 py-8">
  <div class="flex justify-between items-center mb-8 mt-8">
    <h1 class="text-3xl font-bold text-purple-900">My Dream Journal</h1>
    <a
      href="/dreams/new"
      class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
    >
      Record New Dream
    </a>
  </div>

  <!-- Search Bar -->
  <div class="mb-8">
    <div class="relative">
      <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search your dreams..."
        class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-purple-500"
      />
    </div>
  </div>

  {#if loading}
    <div class="text-center py-12">
      <Moon class="mx-auto text-purple-300 animate-pulse mb-4" size={48} />
      <p>Loading dreams...</p>
    </div>
  {:else if error}
    <div class="text-red-500 text-center py-12">{error}</div>
  {:else if filteredDreams.length === 0}
    <div class="text-center py-12">
      <Moon class="mx-auto text-purple-300 mb-4" size={48} />
      <h2 class="text-xl font-semibold text-gray-600">No dreams found</h2>
      <p class="text-gray-500 mt-2">Try adjusting your search or add a new dream!</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredDreams as dream}
        <a
          href="/dreams/{dream.id}"
          class="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
        >
          <h2 class="text-xl font-semibold text-purple-900 mb-2">{dream.title}</h2>
          <p class="text-gray-600 mb-4 line-clamp-3">{dream.description}</p>
          <div class="flex justify-between items-center text-sm text-gray-500">
            <span>{new Date(dream.created_at).toLocaleDateString()}</span>
            {#if dream.mood}
              <span class="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                {dream.mood}
              </span>
            {/if}
          </div>
        </a>
      {/each}
    </div>
  {/if}
</div>