<template>
  <!-- Header -->
  <header class="bg-white shadow-sm sticky top-0 z-40">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center group">
        <div class="flex items-center">
          <div class="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center mr-2 group-hover:bg-sky-600 transition-colors">
            <Icon name="material-symbols:rocket" class="text-white text-lg" />
          </div>
          <span class="text-xl font-bold text-gray-800 group-hover:text-sky-600 transition-colors">ReadRocket</span>
        </div>
      </NuxtLink>

      <!-- Navigation Links -->
      <nav class="hidden md:flex items-center space-x-6">
        <NuxtLink 
          to="/" 
          class="text-gray-600 hover:text-sky-600 transition-colors font-medium"
          active-class="text-sky-600"
        >
          Home
        </NuxtLink>
        <NuxtLink 
          to="/profile" 
          class="text-gray-600 hover:text-sky-600 transition-colors font-medium"
          active-class="text-sky-600"
        >
          Progress
        </NuxtLink>
        <NuxtLink 
          to="/about" 
          class="text-gray-600 hover:text-sky-600 transition-colors font-medium"
          active-class="text-sky-600"
        >
          About
        </NuxtLink>
      </nav>

      <!-- Right side actions -->
      <div class="flex items-center gap-4">
        <!-- Admin button -->
        <div v-if="authStore.isAdmin">
          <NuxtLink
            to="/admin"
            class="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors font-medium flex items-center gap-2"
          >
            <Icon name="material-symbols:admin-panel-settings" class="text-sm" />
            <span class="hidden sm:inline">Admin</span>
          </NuxtLink>
        </div>

        <!-- User menu -->
        <div v-if="authStore.isAuthenticated" class="relative">
          <button
            @click="toggleUserMenu"
            class="flex items-center gap-2 text-gray-700 hover:text-sky-600 transition-colors"
          >
            <div class="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center">
              <Icon name="material-symbols:person" class="text-sky-600" />
            </div>
            <span class="hidden sm:inline text-sm font-medium">
              {{ userDisplayName }}
            </span>
            <Icon name="material-symbols:keyboard-arrow-down" class="text-gray-400" />
          </button>

          <!-- Dropdown menu -->
          <Transition name="fade">
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
            >
              <NuxtLink
                to="/profile"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                @click="showUserMenu = false"
              >
                <div class="flex items-center gap-2">
                  <Icon name="material-symbols:person" class="text-gray-400" />
                  My Progress
                </div>
              </NuxtLink>
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <div class="flex items-center gap-2">
                  <Icon name="material-symbols:logout" class="text-red-400" />
                  Sign Out
                </div>
              </button>
            </div>
          </Transition>
        </div>

        <!-- Auth State for non-authenticated users -->
        <AuthState
          v-else
          :user="authStore.user"
          :loading="authStore.isLoading"
          @login="handleLogin"
          @logout="handleLogout"
        />
      </div>

      <!-- Mobile menu button -->
      <button
        @click="toggleMobileMenu"
        class="md:hidden p-2 text-gray-600 hover:text-sky-600 transition-colors"
      >
        <Icon name="material-symbols:menu" class="text-xl" />
      </button>
    </div>

    <!-- Mobile menu -->
    <Transition name="slide">
      <div
        v-if="showMobileMenu"
        class="md:hidden bg-white border-t border-gray-200 py-4"
      >
        <div class="container mx-auto px-4 space-y-4">
          <NuxtLink 
            to="/" 
            class="block text-gray-600 hover:text-sky-600 transition-colors font-medium"
            @click="showMobileMenu = false"
          >
            Home
          </NuxtLink>
          <NuxtLink 
            to="/profile" 
            class="block text-gray-600 hover:text-sky-600 transition-colors font-medium"
            @click="showMobileMenu = false"
          >
            Progress
          </NuxtLink>
          <NuxtLink 
            to="/about" 
            class="block text-gray-600 hover:text-sky-600 transition-colors font-medium"
            @click="showMobileMenu = false"
          >
            About
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();

// Menu state
const showUserMenu = ref(false);
const showMobileMenu = ref(false);

// Computed properties
const userDisplayName = computed(() => {
  if (!authStore.user) return '';
  return authStore.user.displayName || authStore.user.email?.split('@')[0] || 'User';
});

// Methods
const handleLogin = () => {
  navigateTo("/auth");
};

const handleLogout = async () => {
  await authStore.logout();
  navigateTo("/");
  showUserMenu.value = false;
};

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
  showMobileMenu.value = false;
};

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
  showUserMenu.value = false;
};

// Close menus when clicking outside
onMounted(() => {
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu') && !target.closest('.mobile-menu')) {
      showUserMenu.value = false;
      showMobileMenu.value = false;
    }
  });
});

// Initialize auth state when component mounts
onMounted(async () => {
  // await authStore.initAuthListener();
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
