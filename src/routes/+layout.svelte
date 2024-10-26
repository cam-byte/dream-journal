<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import { Moon, Book, PlusCircle, User } from 'lucide-svelte';
  import '../styles/main.less';
  import { authStore } from '$lib/stores/auth';
</script>

<div class="min-h-screen bg-gray-50 flex flex-col">
  <header class="bg-purple-900 text-white shadow-lg sticky top-0 z-50">
    <div class="container mx-auto px-4 py-4">
      <nav class="flex items-center justify-between">
        <a href="/" class="flex items-center gap-2 text-xl font-bold">
          <Moon size={24} />
          <span>DreamScape</span>
        </a>
        
        <div class="flex items-center gap-6">
          {#if $authStore}
            <a 
              href="/dreams" 
              class="flex items-center gap-2 hover:text-purple-200 transition-colors"
            >
              <Book size={20} />
              <span class="hidden sm:inline">My Dreams</span>
            </a>
            
            <a 
              href="/dreams/new" 
              class="flex items-center gap-2 hover:text-purple-200 transition-colors"
            >
              <PlusCircle size={20} />
              <span class="hidden sm:inline">New Entry</span>
            </a>
            <a              
              href="/dashboard"
              class="flex items-center gap-2 hover:text-purple-200 transition-colors"  
            >
              <User size={20} />
              <span class="hidden sm:inline">Dashboard</span>
            </a>
          {:else}
            <a
              href="/auth/login"
              class="flex items-center gap-2 hover:text-purple-200 transition-colors"  
            >
              <User size={20} />
              <span class="hidden sm:inline">Sign In</span>
            </a>
            <a
              href="/auth/signup"
              class="flex items-center gap-2 hover:text-purple-200 transition-colors"  
            >
              <PlusCircle size={20} />
              <span class="hidden sm:inline">Sign Up</span>
            </a>
          {/if}
        </div>
      </nav>
    </div>
  </header>

  <main class="flex-1">
    <slot />
  </main>

  <footer class="bg-purple-900 text-white py-6 mt-auto">
    <div class="container mx-auto px-4 text-center">
      <p>DreamScape Journal © {new Date().getFullYear()}</p>
    </div>
  </footer>
</div>