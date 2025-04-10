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
        </div></NuxtLink
      >

      <!-- Auth State -->
      <AuthState :user="user" @login="handleLogin" />
    </div>
  </header>
</template>

<script setup lang="ts">
import type { User } from "firebase/auth";
const user = ref<User | null>(null); // Replace with real auth state

const handleLogin = () => {
  // Implement login logic
  console.log("Redirect to login");
  navigateTo("/auth");
};
</script>

<style></style>
