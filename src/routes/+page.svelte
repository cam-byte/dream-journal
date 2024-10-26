<script>
  import { Moon, Sparkles, Brain } from 'lucide-svelte';
</script>

<div class="max-w-4xl mx-auto">
  <!-- Hero Section -->
  <section class="text-center py-12">
    <h1 class="text-4xl md:text-6xl font-bold text-purple-900 mb-4">
      Turn Your Dreams Into Art
    </h1>
    <p class="text-xl text-gray-600 mb-8">
      Record your dreams and watch them transform into unique AI-generated illustrations
    </p>
    <a
      href="/dreams/new"
      class="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors"
    >
      Start Journaling
    </a>
  </section>

  <!-- Features -->
  <section class="grid md:grid-cols-3 gap-8 py-12">
    <div class="text-center p-6 rounded-lg bg-white shadow-md">
      <Moon class="mx-auto text-purple-600 mb-4" size={32} />
      <h2 class="text-xl font-semibold mb-2">Dream Journal</h2>
      <p class="text-gray-600">
        Record and organize your dreams with our intuitive journaling system
      </p>
    </div>

    <div class="text-center p-6 rounded-lg bg-white shadow-md">
      <Sparkles class="mx-auto text-purple-600 mb-4" size={32} />
      <h2 class="text-xl font-semibold mb-2">AI Illustrations</h2>
      <p class="text-gray-600">
        Transform your dream descriptions into stunning visual artwork
      </p>
    </div>

    <div class="text-center p-6 rounded-lg bg-white shadow-md">
      <Brain class="mx-auto text-purple-600 mb-4" size={32} />
      <h2 class="text-xl font-semibold mb-2">Pattern Analysis</h2>
      <p class="text-gray-600">
        Discover recurring themes and symbols in your dream journal
      </p>
    </div>
  </section>
</div>