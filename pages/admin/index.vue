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

    <!-- Loading state with skeleton loader -->
    <div v-if="articles.isLoading" class="space-y-6">
      <div
        v-for="i in 3"
        :key="i"
        class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
      >
        <div
          class="p-5 bg-gradient-to-r from-sky-50 to-sky-100 animate-pulse h-16"
        ></div>
        <div class="divide-y divide-gray-100">
          <div v-for="j in 2" :key="j" class="p-5">
            <div class="h-6 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
            <div
              class="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"
            ></div>
            <div class="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="articles.topics.length === 0"
      class="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100"
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
        class="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2 transition-colors"
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
        class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
      >
        <!-- Topic header -->
        <div
          class="p-5 bg-gradient-to-r from-sky-50 to-sky-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
        >
          <div class="min-w-0">
            <h2 class="text-xl font-semibold text-sky-800 truncate">
              {{ topic.topic }}
            </h2>
            <p class="text-sm text-sky-600 mt-1">
              {{ topic.translations?.length || 0 }}
              {{ topic.translations?.length === 1 ? "article" : "articles" }}
            </p>
          </div>
          <div class="flex gap-2">
            <NuxtLink
              :to="`/admin/articles/edit/${topic.id}`"
              class="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-gray-200 hover:border-sky-300 hover:bg-sky-50 text-gray-700 hover:text-sky-600 transition-colors"
              title="Edit topic"
            >
              <Icon name="material-symbols:edit" class="text-lg" />
              <span class="hidden sm:inline">Edit</span>
            </NuxtLink>
            <button
              @click="confirmDelete(topic)"
              class="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
              title="Delete topic"
            >
              <Icon name="material-symbols:delete" class="text-lg" />
              <span class="hidden sm:inline">Delete</span>
            </button>
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
                  <span
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {{ article?.language?.toUpperCase() }}
                  </span>
                </div>

                <p class="text-gray-500 text-sm mb-4 line-clamp-2">
                  {{ article.content }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete confirmation modal -->
    <Transition name="fade">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
          <div class="flex items-center gap-3 mb-4">
            <Icon
              name="material-symbols:warning"
              class="text-2xl text-red-500"
            />
            <h3 class="text-xl font-semibold text-gray-800">
              {{ deleteModalTitle }}
            </h3>
          </div>
          <p class="text-gray-600 mb-6">{{ deleteModalMessage }}</p>
          <div class="flex justify-end gap-3">
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="executeDelete"
              class="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center gap-2"
              :disabled="isDeleting"
            >
              <Icon
                v-if="isDeleting"
                name="svg-spinners:ring-resize"
                class="text-lg"
              />
              <span>{{ deleteButtonText }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { useToastStore } from "@/stores/toast";

const articles = useArticlesStore();
const toast = useToastStore();

// Delete modal state
const showDeleteModal = ref(false);
const isDeleting = ref(false);
const itemToDelete = ref(null);

const deleteModalTitle = computed(() => {
  return itemToDelete.value
    ? `Delete "${itemToDelete.value.topic}"?`
    : "Confirm Deletion";
});

const deleteModalMessage = computed(() => {
  return itemToDelete.value?.translations?.length > 0
    ? `This will delete the topic and its ${itemToDelete.value.translations.length} associated articles. This action cannot be undone.`
    : "Are you sure you want to delete this? This action cannot be undone.";
});

const deleteButtonText = computed(() => {
  return isDeleting.value ? "Deleting..." : "Delete";
});

onMounted(async () => {
  await articles.fetchTopics();
});

const confirmDelete = (topic) => {
  itemToDelete.value = topic;
  showDeleteModal.value = true;
};

const executeDelete = async () => {
  if (!itemToDelete.value) return;

  try {
    isDeleting.value = true;
    await articles.deleteArticle(itemToDelete.value.id);
    toast.add({
      title: "Success",
      description: "Article deleted successfully",
      icon: "material-symbols:check-circle",
      color: "green",
    });
  } catch (error) {
    toast.add({
      title: "Error",
      description: "Failed to delete article",
      icon: "material-symbols:error",
      color: "red",
    });
    console.error("Delete error:", error);
  } finally {
    isDeleting.value = false;
    showDeleteModal.value = false;
    itemToDelete.value = null;
  }
};

definePageMeta({
  layout: "admin",
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
