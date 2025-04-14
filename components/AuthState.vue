<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

defineProps({
  user: Object,
  loading: Boolean,
});

const emit = defineEmits(["login", "logout", "settings"]);
const showMenu = ref(false);

// Close menu when clicking outside
const onClickOutside = () => {
  showMenu.value = false;
};
</script>

<template>
  <div class="relative">
    <!-- Loading State -->
    <div v-if="loading" class="px-4 py-2">
      <div class="animate-pulse flex items-center space-x-2">
        <div class="w-8 h-8 rounded-full bg-gray-200"></div>
        <div class="h-4 bg-gray-200 rounded w-16"></div>
      </div>
    </div>

    <!-- Logged In State -->
    <div v-else-if="user && !user.isAnonymous" class="flex items-center space-x-4">
      <div class="relative">
        <button
          @click="showMenu = !showMenu"
          class="flex items-center space-x-2 focus:outline-none"
        >
          <span class="text-gray-700 font-medium">
            {{ user.displayName || "My Account" }}
          </span>
          <div
            class="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center border border-sky-200"
          >
            <span class="text-sky-600 text-lg font-medium">
              {{
                user.displayName
                  ? user.displayName.charAt(0).toUpperCase()
                  : "U"
              }}
            </span>
          </div>
          <svg
            class="w-4 h-4 text-gray-500 transition-transform duration-200"
            :class="{ 'rotate-180': showMenu }"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <!-- Dropdown Menu -->
        <Transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <div
            v-if="showMenu"
            v-click-outside="onClickOutside"
            class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100"
          >
            <NuxtLink
              to="/profile"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              @click="showMenu = false"
            >
              <div class="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="w-4 h-4 text-gray-500"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Profile</span>
              </div>
            </NuxtLink>
            <button
              @click="
                () => {
                  emit('logout');
                  showMenu = false;
                }
              "
              class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Logged Out State -->
    <button
      v-else
      @click="emit('login')"
      class="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors flex items-center space-x-2"
    >
      <svg
        class="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
        />
      </svg>
      <span>Login</span>
    </button>
  </div>
</template>
