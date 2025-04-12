<!-- components/admin/Navbar.vue -->
<template>
  <nav class="bg-sky-600 text-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <div class="flex items-center">
          <NuxtLink to="/admin" class="text-xl font-bold">
            Admin Dashboard
          </NuxtLink>
        </div>
        <div class="flex items-center space-x-4">
          <button @click="logout" class="px-3 py-2 rounded hover:bg-sky-700">
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
const logout = async () => {
  const auth = useFirebaseAuth();
  await auth.signOut();
  navigateTo("/login");
};
</script>
