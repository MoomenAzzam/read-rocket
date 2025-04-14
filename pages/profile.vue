<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-4">
      <h1 class="text-2xl font-bold">Profile</h1>
      <p class="text-gray-500">Manage your profile settings.</p>
    </div>

    <div class="flex flex-col gap-4">
      <h2 class="text-xl font-semibold">Profile Information</h2>
      <p class="text-gray-500">Update your profile information.</p>
    </div>

    <div class="flex flex-col gap-4">
      <h2 class="text-xl font-semibold">Change Password</h2>
      <p class="text-gray-500">Update your password.</p>
    </div>
    <pre>
        {{ user }}
    </pre>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
const { $auth } = useNuxtApp();
const authStore = useAuthStore();

const user = computed(() => authStore.user);
onMounted(() => {
  const unsubscribe = $auth.onAuthStateChanged((user) => {
    if (!user) {
      navigateTo("/auth");
    }
  });
  onUnmounted(unsubscribe);
});
</script>
