<template>
  <nav
    class="bg-gradient-to-r from-sky-600 to-sky-500 shadow-lg sticky top-0 z-50"
  >
    <div class="mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <!-- Left side - Branding -->
        <div class="flex items-center space-x-4">
          <NuxtLink
            to="/admin"
            class="flex items-center space-x-2 group"
            aria-label="Admin Dashboard"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-white group-hover:text-sky-200 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span
              class="text-xl font-bold tracking-tight text-white group-hover:text-sky-100 transition-colors"
            >
              Admin Dashboard
            </span>
          </NuxtLink>
        </div>

        <!-- Center - Quick Links -->
        <div class="hidden md:flex items-center space-x-6">
          <NuxtLink
            to="/"
            class="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-sky-700/50 transition-all group"
            aria-label="View public website"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-sky-100 group-hover:text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span class="font-medium text-white/90 group-hover:text-white">
              Public Site
            </span>
          </NuxtLink>
        </div>

        <!-- Right side - User actions -->
        <div class="flex items-center space-x-3">
          <button
            @click="logout"
            class="flex items-center space-x-1 px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition-all group"
            aria-label="Logout"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-white group-hover:text-sky-100"
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
            <span class="font-medium text-white"> Logout </span>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
const logout = async () => {
  const auth = useAuthStore();
  await auth.logout();
  await navigateTo("/auth");
};
</script>
