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
definePageMeta({
  layout: "admin",
});
</script>
