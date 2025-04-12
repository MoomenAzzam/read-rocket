<!-- components/admin/ArticleForm.vue -->
<template>
  <form @submit.prevent="submitForm" class="bg-white rounded-lg shadow p-6">
    <div class="mb-6">
      <label class="block text-gray-700 mb-2">Topic</label>
      <select v-model="formData.topic" class="w-full p-2 border rounded">
        <option value="technology">Technology</option>
        <option value="science">Science</option>
        <option value="business">Business</option>
      </select>
    </div>

    <div class="mb-6">
      <label class="block text-gray-700 mb-2">Author</label>
      <input
        v-model="formData.author"
        type="text"
        class="w-full p-2 border rounded"
        required
      />
    </div>

    <div class="mb-6">
      <label class="block text-gray-700 mb-2">Date</label>
      <input
        v-model="formData.date"
        type="date"
        class="w-full p-2 border rounded"
        required
      />
    </div>

    <div
      v-for="(translation, index) in formData.translations"
      :key="index"
      class="mb-8 border-b pb-6"
    >
      <h3 class="font-medium text-lg mb-4">
        {{ translation.lang.toUpperCase() }} Version
      </h3>

      <div class="mb-4">
        <label class="block text-gray-700 mb-2">Title</label>
        <input
          v-model="translation.title"
          type="text"
          class="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label class="block text-gray-700 mb-2">Content</label>
        <!-- <TiptapEditor v-model="translation.content" /> -->
        <input
          v-model="translation.content"
          type="text"
          class="w-full p-2 border rounded"
          required
        />
      </div>
    </div>

    <div class="flex justify-end space-x-4 mt-6">
      <NuxtLink
        to="/admin/articles"
        class="px-4 py-2 border rounded hover:bg-gray-100"
      >
        Cancel
      </NuxtLink>
      <button
        type="submit"
        class="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded"
        :disabled="articles.isLoading"
      >
        <span v-if="articles.isLoading">Saving...</span>
        <span v-else>{{ submitText }}</span>
      </button>
    </div>
  </form>
</template>

<script setup>
const props = defineProps({
  submitText: {
    type: String,
    default: "Save Article",
  },
  initialData: {
    type: Object,
    default: () => ({
      topic: "technology",
      author: "",
      date: new Date().toISOString().split("T")[0],
      translations: [
        { lang: "en", title: "", content: "" },
        { lang: "ar", title: "", content: "" },
        { lang: "es", title: "", content: "" },
        { lang: "fr", title: "", content: "" },
        { lang: "de", title: "", content: "" },
      ],
    }),
  },
});

const emit = defineEmits(["success"]);

const formData = reactive(JSON.parse(JSON.stringify(props.initialData)));
const articles = useArticlesStore();

const submitForm = async () => {
  try {
    if (formData.id) {
      await articles.updateArticle(formData.id, formData);
    } else {
      await articles.createArticle(formData);
    }
    emit("success");
  } catch (error) {
    console.error("Error saving article:", error);
  }
};
</script>
