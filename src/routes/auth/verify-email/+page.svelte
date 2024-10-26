<script lang="ts">
    import { Mail } from 'lucide-svelte';
  </script>
  
  <div class="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-md text-center">
    <Mail class="mx-auto text-purple-600 mb-4" size={48} />
    <h1 class="text-2xl font-bold text-purple-900 mb-4">Check your email</h1>
    <p class="text-gray-600 mb-6">
      We've sent you a verification link. Please check your email and click the link to verify your account.
    </p>
    <p class="text-sm text-gray-500">
      Didn't receive the email? Check your spam folder or
      <button class="text-purple-600 hover:text-purple-500">request a new link</button>
    </p>
  </div>