<template>
  <div>
    <Navbar />
    <slot />
  </div>
</template>

<script setup>
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const config = useRuntimeConfig();
watch(
  () => authStore.user,
  (user) => {
    if (user) {
      authStore.isAdmin = user.uid == config.public.adminId;
    } else {
      authStore.isAdmin = false;
    }
  },
  { immediate: true }
);
</script>
