<script lang="ts">
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabase';
  
  let title = '';
  let description = '';
  let mood = '';
  let isLucid = false;
  let tags = '';
  let loading = false;
  let error = '';

  const moods = [
    'Peaceful',
    'Anxious',
    'Exciting',
    'Mysterious',
    'Scary',
    'Joyful',
    'Confusing'
  ];

  async function handleSubmit() {
    loading = true;
    error = '';
    
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('No user logged in');

      // Insert dream
      const { data, error: insertError } = await supabase
        .from('dreams')
        .insert([
          {
            user_id: user.id,
            title,
            description,
            mood: mood.toLowerCase(),
            is_lucid: isLucid,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
          }
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      // Redirect to dreams page
      goto('/dreams');
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }
</script>
  
  <div class="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
    <h1 class="text-2xl font-bold text-purple-900 mb-6">Record New Dream</h1>
  
    <form on:submit|preventDefault={handleSubmit} class="space-y-6">
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700">Dream Title</label>
        <input
          type="text"
          id="title"
          bind:value={title}
          required
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
          placeholder="Give your dream a memorable title"
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
          placeholder="Describe your dream in detail..."
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
  
      <button
        type="submit"
        disabled={loading}
        class="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {loading ? 'Saving dream...' : 'Save Dream'}
      </button>
    </form>
  </div>