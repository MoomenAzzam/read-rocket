<!-- pages/admin/articles/new.vue -->
<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold text-sky-800 mb-6">Create New Article</h1>
    <AdminArticleForm @success="onSuccess" />
  </div>
</template>

<script setup>
import { AdminArticleForm } from "#components";

const onSuccess = () => {
  navigateTo("/admin");
};
definePageMeta({
  layout: "admin",
});
</script>
