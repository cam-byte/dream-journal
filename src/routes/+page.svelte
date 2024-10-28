<script>
  import { Moon, Sparkles, Brain } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';

  let showTitle = false;
  let showSubtitle = false;
  let showFeatures = false;
  let showMoon = false;
  let moonPhase = 0.85; // Start at the target position

  onMount(() => {
    // Start moon animation after a delay
    setTimeout(() => {
      showMoon = true;
      // Reset phase to 0 after the moon is hidden
      moonPhase = 0;
      
      const startTime = Date.now();
      const duration = 2000;
      const startPhase = 0;
      const targetPhase = 0.85;

      // Slight delay to ensure the moon is fully faded in before animation
      setTimeout(() => {
        const animation = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          moonPhase = startPhase + (targetPhase - startPhase) * easeProgress;
          
          if (progress >= 1) {
            clearInterval(animation);
          }
        }, 16);
      }, 50);
    }, 500);

    // Rest of the animation sequence
    setTimeout(() => showTitle = true, 1000);
    setTimeout(() => showSubtitle = true, 2000);
    setTimeout(() => showFeatures = true, 3000);
  });
</script>

<div class="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900 text-white">
  <!-- Hero Section -->
  <div class="relative overflow-hidden">
    <!-- Animated stars background -->
    <div class="absolute inset-0 opacity-50">
      {#each Array(50) as _, i}
        <div
          class="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
          style="
            left: {Math.random() * 100}%;
            top: {Math.random() * 100}%;
            animation-delay: {Math.random() * 3}
          "
        ></div>
      {/each}
    </div>

    <div class="max-w-6xl mx-auto px-4 pt-24 pb-32">
      <!-- Animated Moon -->
      {#if showMoon}
      <div class="relative w-40 h-40 mx-auto mb-12" in:fade={{ duration: 100 }}>
        <svg viewBox="-20 -20 140 140" class="w-full h-full">
          <defs>
            <linearGradient id="moonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#EDE9FE" />
              <stop offset="100%" stop-color="#DDD6FE" />
            </linearGradient>
          </defs>
          <!-- Base moon circle -->
          <circle cx="50" cy="50" r="48" fill="url(#moonGradient)" />
          <!-- Sliding dark circle to create crescent effect -->
          <circle 
            cx="50" 
            cy="50" 
            r="48" 
            fill="rgba(76, 29, 149, 0.95)"
            transform="translate({50 - 50 * Math.cos(moonPhase * Math.PI * 2)}, 0)"
          />
        </svg>
      </div>
      {/if}
      

      <!-- Animated Text -->
      <div class="text-center space-y-6">
        {#if showTitle}
          <h1 
            class="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-purple-100"
            in:fly="{{ y: 20, duration: 1000 }}"
          >
            Turn Your Dreams Into Art
          </h1>
        {/if}

        {#if showSubtitle}
          <p 
            class="text-xl md:text-2xl text-purple-200 max-w-2xl mx-auto"
            in:fly="{{ y: 20, duration: 1000 }}"
          >
            Record your dreams and watch them transform into unique AI-generated illustrations
          </p>
        {/if}

        {#if showSubtitle}
          <div in:fade="{{ duration: 1000 }}">
            <a
              href="/dreams/new"
              class="inline-block bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Start Your Journey
            </a>
          </div>
        {/if}
      </div>
    </div>
  </div>

  <!-- Features -->
  {#if showFeatures}
    <div class="max-w-6xl mx-auto px-4 pb-24" in:fly="{{ y: 50, duration: 1000 }}">
      <div class="grid md:grid-cols-3 gap-8">
        <div class="bg-white/10 backdrop-blur-lg p-8 rounded-2xl hover:bg-white/20 transition-all transform hover:-translate-y-1">
          <Moon class="w-12 h-12 text-purple-300 mb-6" />
          <h2 class="text-2xl font-semibold mb-4">Dream Journal</h2>
          <p class="text-purple-200">
            Record and organize your dreams with our intuitive journaling system
          </p>
        </div>

        <div class="bg-white/10 backdrop-blur-lg p-8 rounded-2xl hover:bg-white/20 transition-all transform hover:-translate-y-1">
          <Sparkles class="w-12 h-12 text-purple-300 mb-6" />
          <h2 class="text-2xl font-semibold mb-4">AI Illustrations</h2>
          <p class="text-purple-200">
            Transform your dream descriptions into stunning visual artwork
          </p>
        </div>

        <div class="bg-white/10 backdrop-blur-lg p-8 rounded-2xl hover:bg-white/20 transition-all transform hover:-translate-y-1">
          <Brain class="w-12 h-12 text-purple-300 mb-6" />
          <h2 class="text-2xl font-semibold mb-4">Pattern Analysis</h2>
          <p class="text-purple-200">
            Discover recurring themes and symbols in your dream journal
          </p>
        </div>
      </div>
    </div>
  {/if}
</div>