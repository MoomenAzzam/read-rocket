<!-- pages/admin/articles/edit/[id].vue -->
<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold text-sky-800 mb-6">Edit Article</h1>
    <ArticleForm
      v-if="!articles.isLoading"
      :key="articles.currentArticle?.id"
      :initial-data="articles.currentArticle"
      submit-text="Update Article"
    />
    <div v-else class="text-center py-12">
      <p class="text-gray-500">Loading article...</p>
    </div>
  </div>
</template>

<script setup>
import ArticleForm from "~/components/admin/ArticleForm.vue";
const route = useRoute();
const articles = useArticlesStore();

onMounted(async () => {
  await articles.fetchArticle(route.params.id);
});


definePageMeta({
  layout: "admin",
});
</script>
