<!-- components/admin/ArticleForm.vue -->
<template>
  <form
    @submit.prevent="submitForm"
    class="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto"
  >
    <!-- General Article Info -->
    <div class="space-y-6 mb-8">
      <h2 class="text-2xl font-bold text-gray-800 border-b pb-2">
        Article Information
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Topic</label
          >
          <select
            v-model="formData.topic"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="technology">Technology</option>
            <option value="science">Science</option>
            <option value="business">Business</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Author</label
          >
          <input
            v-model="formData.author"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Date</label
          >
          <input
            v-model="formData.date"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            required
          />
        </div>
      </div>
    </div>

    <!-- Language Versions with Questions -->
    <div
      v-for="(translation, index) in formData.translations"
      :key="index"
      class="mb-10 p-6 border border-gray-200 rounded-lg bg-gray-50"
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-800 flex items-center">
          <span
            class="inline-flex items-center justify-center w-8 h-8 mr-2 bg-sky-100 text-sky-800 rounded-full text-sm font-medium"
          >
            {{ index + 1 }}
          </span>
          {{ translation.lang.toUpperCase() }} Version
        </h3>
        <span
          class="px-3 py-1 text-xs font-medium rounded-full"
          :class="
            translation.lang === 'en'
              ? 'bg-blue-100 text-blue-800'
              : translation.lang === 'ar'
              ? 'bg-green-100 text-green-800'
              : 'bg-purple-100 text-purple-800'
          "
        >
          {{ translation.lang }}
        </span>
      </div>

      <div class="space-y-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Title</label
          >
          <input
            v-model="translation.title"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Content</label
          >
          <textarea
            v-model="translation.content"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            required
          ></textarea>
        </div>
      </div>

      <!-- Questions for this language -->
      <div class="mt-8">
        <h4 class="text-md font-medium text-gray-800 mb-4 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2 text-sky-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
              clip-rule="evenodd"
            />
          </svg>
          Quiz Questions
        </h4>

        <div
          v-for="(question, qIndex) in translation.questions"
          :key="qIndex"
          class="mb-5 p-4 border border-gray-200 rounded-md bg-white shadow-sm"
        >
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Question {{ qIndex + 1 }}</label
            >
            <input
              v-model="question.text"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
              placeholder="Enter the question text"
              required
            />
          </div>

          <div class="flex items-center space-x-4">
            <label class="inline-flex items-center">
              <input
                type="radio"
                :name="'question-' + index + '-' + qIndex"
                :value="true"
                v-model="question.answer"
                class="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300"
              />
              <span class="ml-2 text-sm text-gray-700">True</span>
            </label>
            <label class="inline-flex items-center">
              <input
                type="radio"
                :name="'question-' + index + '-' + qIndex"
                :value="false"
                v-model="question.answer"
                class="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300"
              />
              <span class="ml-2 text-sm text-gray-700">False</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Actions -->
    <div class="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
      <NuxtLink
        to="/admin/articles"
        class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
      >
        Cancel
      </NuxtLink>
      <button
        type="submit"
        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
        :disabled="articles.isLoading"
      >
        <span v-if="articles.isLoading" class="flex items-center">
          <svg
            class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Saving...
        </span>
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
        {
          lang: "en",
          title: "",
          content: "",
          questions: [
            { text: "", answer: null },
            { text: "", answer: null },
            { text: "", answer: null },
          ],
        },
        {
          lang: "ar",
          title: "",
          content: "",
          questions: [
            { text: "", answer: null },
            { text: "", answer: null },
            { text: "", answer: null },
          ],
        },
        {
          lang: "es",
          title: "",
          content: "",
          questions: [
            { text: "", answer: null },
            { text: "", answer: null },
            { text: "", answer: null },
          ],
        },
        {
          lang: "fr",
          title: "",
          content: "",
          questions: [
            { text: "", answer: null },
            { text: "", answer: null },
            { text: "", answer: null },
          ],
        },
        {
          lang: "de",
          title: "",
          content: "",
          questions: [
            { text: "", answer: null },
            { text: "", answer: null },
            { text: "", answer: null },
          ],
        },
      ],
    }),
  },
});

const emit = defineEmits(["success"]);

const formData = reactive(JSON.parse(JSON.stringify(props.initialData)));
const articles = useArticlesStore();

const submitForm = async () => {
  try {
    // Prepare the data for Firebase
    const articleData = {
      ...formData,
      translations: formData.translations.map((translation) => ({
        ...translation,
        questions: translation.questions.map((q) => ({
          text: q.text,
          answer: q.answer,
        })),
      })),
    };

    if (formData.id) {
      await articles.updateArticle(formData.id, articleData);
    } else {
      await articles.createArticle(articleData);
    }
    emit("success");
  } catch (error) {
    console.error("Error saving article:", error);
  }
};
</script>
