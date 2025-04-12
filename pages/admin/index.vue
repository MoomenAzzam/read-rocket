<!-- pages/admin/articles/index.vue -->
<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header with create button -->
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
    >
      <div>
        <h1 class="text-3xl font-bold text-sky-800">Article Management</h1>
        <p class="text-gray-500 mt-1">Manage all your multilingual content</p>
      </div>
      <NuxtLink
        to="/admin/articles/new"
        class="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-2"
      >
        <Icon name="material-symbols:add" class="text-xl" />
        <span>New Article</span>
      </NuxtLink>
    </div>

    <!-- Loading state -->
    <div
      v-if="articles.loading"
      class="flex flex-col items-center justify-center py-12"
    >
      <Icon name="svg-spinners:bars-scale" class="text-4xl text-sky-500 mb-4" />
      <p class="text-gray-600">Loading your articles...</p>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="articles.topics.length === 0"
      class="bg-white rounded-xl p-8 text-center shadow-sm"
    >
      <Icon
        name="material-symbols:article-outline"
        class="text-5xl text-gray-300 mx-auto mb-4"
      />
      <h3 class="text-xl font-medium text-gray-700 mb-2">No articles yet</h3>
      <p class="text-gray-500 mb-6">
        Get started by creating your first multilingual article
      </p>
      <NuxtLink
        to="/admin/articles/new"
        class="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2"
      >
        <Icon name="material-symbols:add" />
        Create Article
      </NuxtLink>
    </div>

    <!-- Articles list -->
    <div v-else class="space-y-6">
      <div
        v-for="topic in articles.topics"
        :key="topic.id"
        class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
      >
        <!-- Topic header -->
        <div
          class="p-5 bg-gradient-to-r from-sky-50 to-sky-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
        >
          <div>
            <h2 class="text-xl font-semibold text-sky-800">
              <pre>{{ topic.topic }}</pre>
            </h2>
            <p class="text-sm text-sky-600 mt-1">
              {{ topic.translations?.length || 0 }}
              {{ topic.translations?.length === 1 ? "article" : "articles" }}
            </p>
          </div>
        </div>

        <!-- Articles list -->
        <div class="divide-y divide-gray-100">
          <div
            v-for="article in topic.translations"
            :key="article.title"
            class="p-5 hover:bg-gray-50 transition-colors group"
          >
            <div class="flex flex-col md:flex-row md:items-start gap-5">
              <!-- Article content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start gap-3 mb-3">
                  <h3 class="text-lg font-medium text-gray-800 truncate">
                    {{ article.title }}
                  </h3>
                </div>

                <p class="text-gray-500 text-sm mb-4 line-clamp-2">
                  {{ article.content }}
                </p>
              </div>

              <!-- Actions -->
            </div>
          </div>
          <!-- <div class="flex md:flex gap-2 m-4 justify-between">
            <NuxtLink
              :to="`/admin/articles/edit/${topic.id}`"
              class="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-gray-200 hover:border-sky-300 hover:bg-sky-50 text-gray-700 hover:text-sky-600 transition-colors"
              title="Edit article"
            >
              <Icon
                name="material-symbols:edit"
                class="text-lg opacity-70 group-hover:opacity-100"
              />
              <span class="hidden sm:inline">Edit</span>
            </NuxtLink>
            <button
              @click="confirmDelete(topic.id)"
              class="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
              title="Delete article"
            >
              <Icon
                name="material-symbols:delete"
                class="text-lg opacity-70 group-hover:opacity-100"
              />
              <span class="hidden sm:inline">Delete</span>
            </button>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const articles = useArticlesStore();
onMounted(async () => {
  await articles.fetchTopics();
});

// const confirmDelete = async (id) => {
//   const confirmed = await openConfirmModal(
//     "Delete Article",
//     "Are you sure you want to delete this article? This action cannot be undone.",
//     "Delete",
//     "Cancel"
//   );
//   if (confirmed) {
//     await articles.deleteArticle(id);
//   }
// };

definePageMeta({
  layout: "admin",
});
</script>

<style scoped>
/* Custom truncation for long content */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Flag icons styling */
.fi {
  display: inline-block;
  width: 1em;
  height: 1em;
  vertical-align: middle;
  background-size: contain;
  background-position: 50%;
  background-repeat: no-repeat;
  font-size: 1em;
  line-height: 1em;
  border-radius: 50%;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.5);
}
</style>
