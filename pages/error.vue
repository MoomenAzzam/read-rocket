<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4"
  >
    <div
      class="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden p-8 text-center"
    >
      <!-- Error Icon -->
      <div
        class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6"
      >
        <svg
          class="h-10 w-10 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <!-- Error Message -->
      <h1 class="text-3xl font-bold text-gray-800 mb-2">
        Something went wrong
      </h1>
      <p class="text-gray-600 mb-6">
        We're sorry, but an unexpected error occurred. Please try again later.
      </p>

      <!-- Error Code (if available) -->
      <div
        v-if="$route.query.code"
        class="bg-gray-100 px-3 py-2 rounded-md inline-block mb-6"
      >
        <code class="text-sm font-mono text-gray-700"
          >Error: {{ $route.query.code }}</code
        >
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          @click="goBack"
          class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Go Back
        </button>
        <NuxtLink
          to="/"
          class="px-4 py-2 bg-indigo-600 rounded-md text-white hover:bg-indigo-700 transition-colors text-center"
        >
          Return Home
        </NuxtLink>
      </div>
    </div>

    <!-- Footer Link -->
    <!-- <p class="mt-8 text-sm text-gray-500">
      Need help?
      <a href="#" class="text-indigo-600 hover:underline">Contact support</a>
    </p> -->
  </div>
</template>

<script setup>
const router = useRouter();

const goBack = () => {
  router.go(-1);
};

</script>
