<!-- pages/admin/articles/edit/[id].vue -->
<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold text-sky-800 mb-6">Edit Article</h1>
    <ArticleForm
      v-if="!articles.loading"
      :initial-data="articles.getArticle"
      submit-text="Update Article"
      @success="onSuccess"
    />
    <div v-else class="text-center py-12">
      <p class="text-gray-500">Loading article...</p>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const articles = useArticlesStore();

onMounted(() => {
  articles.fetchArticle(route.params.id);
});

const onSuccess = () => {
  navigateTo("/admin/articles");
};
definePageMeta({
  layout: "admin",
});
</script>
