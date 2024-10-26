<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { supabase } from '$lib/supabase';
    import { onMount } from 'svelte';
    import { Loader, ArrowLeft } from 'lucide-svelte';
  
    let dream: any = null;
    let loading = true;
    let saving = false;
    let error = '';
  
    let title = '';
    let description = '';
    let mood = '';
    let isLucid = false;
    let tags = '';
  
    const moods = [
      'Peaceful',
      'Anxious',
      'Exciting',
      'Mysterious',
      'Scary',
      'Joyful',
      'Confusing'
    ];
  
    async function loadDream() {
      try {
        const { data, error: fetchError } = await supabase
          .from('dreams')
          .select('*')
          .eq('id', $page.params.id)
          .single();
  
        if (fetchError) throw fetchError;
        if (!data) throw new Error('Dream not found');
  
        dream = data;
        title = data.title;
        description = data.description;
        mood = data.mood || '';
        isLucid = data.is_lucid;
        tags = data.tags ? data.tags.join(', ') : '';
      } catch (e) {
        error = e.message;
      } finally {
        loading = false;
      }
    }
  
    async function handleSubmit() {
      saving = true;
      error = '';
  
      try {
        const { error: updateError } = await supabase
          .from('dreams')
          .update({
            title,
            description,
            mood: mood.toLowerCase(),
            is_lucid: isLucid,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            updated_at: new Date().toISOString()
          })
          .eq('id', dream.id);
  
        if (updateError) throw updateError;
  
        goto(`/dreams/${dream.id}`);
      } catch (e) {
        error = e.message;
        saving = false;
      }
    }
  
    onMount(() => {
      loadDream();
    });
  </script>
  
  <div class="max-w-2xl mx-auto px-4 py-8">
    <a
      href="/dreams/{$page.params.id}"
      class="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6"
    >
      <ArrowLeft size={20} class="mr-2" />
      Back to Dream
    </a>
  
    {#if loading}
      <div class="text-center py-12">
        <Loader class="mx-auto text-purple-600 animate-spin mb-4" size={48} />
        <p class="text-gray-600">Loading dream...</p>
      </div>
    {:else if error}
      <div class="text-red-500 text-center py-12">{error}</div>
    {:else}
      <div class="bg-white rounded-lg shadow-md p-6">
        <h1 class="text-2xl font-bold text-purple-900 mb-6">Edit Dream</h1>
  
        <form on:submit|preventDefault={handleSubmit} class="space-y-6">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700">Dream Title</label>
            <input
              type="text"
              id="title"
              bind:value={title}
              required
              class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
  
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              bind:value={description}
              required
              rows="4"
              class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
            ></textarea>
          </div>
  
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="mood" class="block text-sm font-medium text-gray-700">Mood</label>
              <select
                id="mood"
                bind:value={mood}
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
              >
                <option value="">Select mood...</option>
                {#each moods as moodOption}
                  <option value={moodOption.toLowerCase()}>{moodOption}</option>
                {/each}
              </select>
            </div>
  
            <div>
              <label for="tags" class="block text-sm font-medium text-gray-700">Tags</label>
              <input
                type="text"
                id="tags"
                bind:value={tags}
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
                placeholder="flying, water, chase (comma separated)"
              />
            </div>
          </div>
  
          <div class="flex items-center">
            <input
              type="checkbox"
              id="isLucid"
              bind:checked={isLucid}
              class="h-4 w-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <label for="isLucid" class="ml-2 block text-sm text-gray-700">
              This was a lucid dream (I knew I was dreaming)
            </label>
          </div>
  
          {#if error}
            <div class="text-red-500 text-sm">{error}</div>
          {/if}
  
          <div class="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              class="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {#if saving}
                <Loader class="inline animate-spin mr-2" size={20} />
                Saving Changes...
              {:else}
                Save Changes
              {/if}
            </button>
            
            <a
              href="/dreams/{dream.id}"
              class="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-center"
            >
              Cancel
            </a>
          </div>
        </form>
      </div>
    {/if}
  </div>