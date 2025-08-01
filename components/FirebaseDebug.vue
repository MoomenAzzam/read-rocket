<template>
  <div v-if="showDebug" class="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg text-sm max-w-md z-50">
    <h3 class="font-bold mb-2">Firebase Debug Info</h3>
    <div class="space-y-1">
      <div><strong>Auth Domain:</strong> {{ authDomain }}</div>
      <div><strong>Project ID:</strong> {{ projectId }}</div>
      <div><strong>API Key:</strong> {{ apiKey ? '✅ Set' : '❌ Missing' }}</div>
      <div><strong>Auth State:</strong> {{ authState }}</div>
      <div><strong>User:</strong> {{ userInfo }}</div>
      <div><strong>Domain:</strong> {{ currentDomain }}</div>
    </div>
    <button 
      @click="showDebug = false" 
      class="mt-2 text-xs bg-gray-600 px-2 py-1 rounded"
    >
      Close
    </button>
  </div>
</template>

<script setup>
const showDebug = ref(false);
const config = useRuntimeConfig();

// Debug info
const authDomain = computed(() => config.public.authDomain || 'Not set');
const projectId = computed(() => config.public.projectId || 'Not set');
const apiKey = computed(() => config.public.firebaseApiKey);
const authState = computed(() => {
  const authStore = useAuthStore();
  return authStore.isAuthenticated ? 'Authenticated' : 'Not authenticated';
});
const userInfo = computed(() => {
  const authStore = useAuthStore();
  return authStore.user ? `${authStore.user.email} (${authStore.user.uid})` : 'No user';
});
const currentDomain = computed(() => window.location.hostname);

// Show debug on triple click
let clickCount = 0;
let clickTimer;

const handleTripleClick = () => {
  clickCount++;
  clearTimeout(clickTimer);
  
  clickTimer = setTimeout(() => {
    if (clickCount >= 3) {
      showDebug.value = true;
    }
    clickCount = 0;
  }, 500);
};

onMounted(() => {
  document.addEventListener('click', handleTripleClick);
});

onUnmounted(() => {
  document.removeEventListener('click', handleTripleClick);
});
</script> 