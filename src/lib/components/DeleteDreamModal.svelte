<script lang="ts">
    import { Loader, AlertTriangle } from 'lucide-svelte';
    import { supabase } from '$lib/supabase';
    import { goto } from '$app/navigation';
  
    export let dreamId: string;
    export let isOpen: boolean;
    export let onClose: () => void;
  
    let deleting = false;
    let error = '';

    console.log('Modal mounted with dreamId:', dreamId);
  
    async function handleDelete() {
      deleting = true;
      error = '';
      
      try {
        // First verify the dream exists and belongs to the user
        const { data: dream, error: fetchError } = await supabase
          .from('dreams')
          .select('id')
          .eq('id', dreamId)
          .single();

        if (fetchError) throw fetchError;
        if (!dream) throw new Error('Dream not found');

        // Then delete it
        const { error: deleteError } = await supabase
          .from('dreams')
          .delete()
          .eq('id', dreamId);
  
        if (deleteError) throw deleteError;
  
        onClose();
        goto('/dreams', { replaceState: true });
      } catch (e) {
        error = e.message;
        console.error('Delete error:', e);
      } finally {
        deleting = false;
      }
    }
</script>
  
  {#if isOpen}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <div class="flex items-center gap-3 text-red-600 mb-4">
          <AlertTriangle size={24} />
          <h2 class="text-xl font-semibold">Delete Dream</h2>
        </div>
  
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete this dream? This action cannot be undone.
        </p>
  
        {#if error}
          <div class="text-red-500 text-sm mb-4">{error}</div>
        {/if}
  
        <div class="flex gap-3">
          <button
            on:click={handleDelete}
            disabled={deleting}
            class="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {#if deleting}
              <Loader class="inline animate-spin mr-2" size={16} />
              Deleting...
            {:else}
              Delete Dream
            {/if}
          </button>
          
          <button
            on:click={onClose}
            disabled={deleting}
            class="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  {/if}