<script lang="ts">
  import { page } from '$app/stores';
  import { supabase } from '$lib/supabase';
  import { Moon, Calendar, ArrowLeft, Tag, Trash2, Edit, Loader } from 'lucide-svelte';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import DeleteDreamModal from '$lib/components/DeleteDreamModal.svelte';

  let dream: any = null;
  let loading = true;
  let error = '';
  let deleting = false;
  let showDeleteModal = false;
  let dreamToDelete: string | null = null;

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
      dreamToDelete = dream.id;
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  async function deleteDream() {
    if (!confirm('Are you sure you want to delete this dream?')) return;
    
    deleting = true;
    try {
      const { error: deleteError } = await supabase
        .from('dreams')
        .delete()
        .eq('id', dream.id);

      if (deleteError) throw deleteError;
      goto('/dreams');
    } catch (e) {
      error = e.message;
      deleting = false;
    }
  }

  onMount(() => {
    loadDream();
  });
</script>

<div class="max-w-4xl mx-auto px-4 py-8">
  <a
    href="/dreams"
    class="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6"
  >
    <ArrowLeft size={20} class="mr-2" />
    Back to Dreams
  </a>

  {#if loading}
    <div class="text-center py-12">
      <Loader class="mx-auto text-purple-600 animate-spin mb-4" size={48} />
      <p class="text-gray-600">Loading dream...</p>
    </div>
  {:else if error}
    <div class="text-center py-12">
      <p class="text-red-500">{error}</p>
    </div>
  {:else}
    <article class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="p-8">
        <!-- Header with date and actions -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-2 text-gray-500">
            <Calendar size={20} />
            <span>{new Date(dream.created_at).toLocaleDateString()}</span>
          </div>
          <div class="flex items-center gap-4">
            {#if dream.is_lucid}
              <span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                Lucid Dream
              </span>
            {/if}
            <div class="flex items-center gap-2">
              <a 
                href="/dreams/{dream.id}/edit" 
                class="p-2 text-gray-600 hover:text-purple-600 transition-colors"
              >
                <Edit size={20} />
              </a>
              <button 
                on:click={() => showDeleteModal = true}
                class="p-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </div>

        <!-- Dream content -->
        <h1 class="text-3xl font-bold text-purple-900 mb-4">{dream.title}</h1>
        
        {#if dream.mood}
          <div class="mb-4">
            <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm capitalize">
              {dream.mood}
            </span>
          </div>
        {/if}

        <p class="text-gray-600 leading-relaxed mb-6 whitespace-pre-line">
          {dream.description}
        </p>

        <!-- Tags -->
        {#if dream.tags && dream.tags.length > 0}
          <div class="flex items-start gap-2 mt-6 pt-6 border-t border-gray-100">
            <Tag size={20} class="text-gray-400 mt-1" />
            <div class="flex flex-wrap gap-2">
              {#each dream.tags as tag}
                <span class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                  {tag}
                </span>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    </article>

    <!-- Add placeholder for future AI image generation -->
    <div class="mt-8 p-8 bg-white rounded-lg shadow-md text-center">
      <Moon class="mx-auto text-purple-300 mb-4" size={48} />
      <h2 class="text-xl font-semibold text-gray-600 mb-2">Dream Visualization</h2>
      <p class="text-gray-500">AI-generated visualization coming soon...</p>
    </div>
  {/if}
</div>

{#if dreamToDelete && showDeleteModal}
  <DeleteDreamModal
    dreamId={dreamToDelete}
    isOpen={true}
    onClose={() => showDeleteModal = false}
  />
{/if}