<script setup lang="ts">
import type { User } from "firebase/auth";

defineProps<{
  user: User | null;
}>();

const emit = defineEmits<{
  (e: "login"): void;
}>();
</script>

<template>
  <div v-if="user" class="flex items-center space-x-2">
    <span class="text-gray-700">{{ user.displayName || "User" }}</span>
    <div
      class="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center"
    >
      <span class="text-sky-600 text-sm font-medium">
        {{ user.displayName ? user.displayName.charAt(0).toUpperCase() : "U" }}
      </span>
    </div>
  </div>
  <button
    v-else
    @click="emit('login')"
    class="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
  >
    Login
  </button>
</template>
