<template>
  <SplashScreen v-if="showSplash" />
  <NuxtLayout v-else name="default">
    <NuxtPage />
  </NuxtLayout>
</template>

<script lang="ts" setup>
const authStore = useAuthStore();
const showSplash = ref(true);

// Constants
const SPLASH_DURATION = 1000;

// Initialize app with splash screen and auth
const initializeApp = async () => {
  await authStore.initAuthListener();
  showSplash.value = false;
};

onMounted(() => {
  setTimeout(initializeApp, SPLASH_DURATION);
});

</script>
