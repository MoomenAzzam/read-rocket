<template>
  <!-- Header -->
  <header class="bg-white shadow-sm">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <!-- Logo -->
      <NuxtLink to="/">
        <div class="flex items-center">
          <svg
            class="w-8 h-8 text-sky-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L1 12h3v9h6v-6h4v6h6v-9h3L12 2z" />
          </svg>
          <span class="ml-2 text-xl font-bold text-gray-800">ReadRocket</span>
        </div>
      </NuxtLink>
      <div v-if="authStore.isAdmin">
        <button>
          <NuxtLink
            to="/admin"
            class="ml-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded"
            >Admin</NuxtLink
          >
        </button>
      </div>

      <!-- Auth State -->
      <AuthState
        :user="authStore.user"
        :loading="authStore.isLoading"
        @login="handleLogin"
        @logout="handleLogout"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();

// Initialize auth state when component mounts
onMounted(async () => {
  // await authStore.initAuthListener();
});

const handleLogin = () => {
  navigateTo("/auth");
};

const handleLogout = async () => {
  await authStore.logout();
  navigateTo("/");
};
</script>

<style scoped></style>
