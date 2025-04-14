<!-- layouts/admin.vue -->
<template>
  <div class="min-h-screen bg-sky-50">
    <AdminNavbar />
    <div class="p-6">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "~/stores/auth";

definePageMeta({
  layout: "admin",
});

const authStore = useAuthStore();
const config = useRuntimeConfig();
watch(
  () => authStore.user,
  (user) => {
    if (user) {
      authStore.isAdmin = user.uid == config.public.adminId;
    } else {
      authStore.isAdmin = false;
      navigateTo("/");
    }
  },
  { immediate: true }
);
</script>
