<!-- components/admin/ArticleForm.vue -->
<template>
  <form
    @submit.prevent="submitForm"
    class="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto"
  >
    <!-- Progress Indicator -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-2">
        <h2 class="text-2xl font-bold text-gray-800">Create New Article</h2>
        <span class="text-sm text-gray-500">{{ formProgress }}% Complete</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div 
          class="bg-sky-500 h-2 rounded-full transition-all duration-300"
          :style="{ width: formProgress + '%' }"
        ></div>
      </div>
    </div>

    <!-- General Article Info -->
    <div class="space-y-6 mb-8">
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div class="flex items-start gap-3">
          <Icon name="material-symbols:info" class="text-blue-500 text-xl mt-0.5" />
          <div>
            <h3 class="font-semibold text-blue-800 mb-1">Article Guidelines</h3>
            <ul class="text-sm text-blue-700 space-y-1">
              <li>• Write engaging content that's suitable for speed reading practice</li>
              <li>• Keep paragraphs concise (2-3 sentences each)</li>
              <li>• Create 3 comprehension questions per language</li>
              <li>• Ensure questions test understanding, not just memorization</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-if="formData">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Topic <span class="text-red-500">*</span>
          </label>
          <select
            v-model="formData.topic"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            required
          >
            <option value="">Select a topic</option>
            <option value="technology">Technology</option>
            <option value="science">Science</option>
            <option value="business">Business</option>
            <option value="health">Health & Wellness</option>
            <option value="environment">Environment</option>
            <option value="culture">Culture & Arts</option>
          </select>
        </div>

        <div v-if="formData">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Author <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.author"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            placeholder="Enter author name"
            required
          />
        </div>

        <div v-if="formData">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Publication Date <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.date"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            required
          />
        </div>

        <div v-if="formData">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Difficulty Level
          </label>
          <select
            v-model="formData.difficulty"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Language Versions with Questions -->
    <div v-if="formData">
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
            :class="getLanguageClass(translation.lang)"
          >
            {{ getLanguageName(translation.lang) }}
          </span>
        </div>

        <div class="space-y-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Title <span class="text-red-500">*</span>
            </label>
            <input
              v-model="translation.title"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
              :placeholder="`Enter title in ${getLanguageName(translation.lang)}`"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Content <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <textarea
                v-model="translation.content"
                rows="8"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                :placeholder="`Write your article content in ${getLanguageName(translation.lang)}. Use double line breaks to separate paragraphs.`"
                required
              ></textarea>
              <div class="absolute bottom-2 right-2 text-xs text-gray-400">
                {{ translation.content.length }} characters
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-1">
              Recommended: 200-500 words for optimal reading test experience
            </p>
          </div>
        </div>

        <!-- Questions for this language -->
        <div class="mt-8">
          <h4 class="text-md font-medium text-gray-800 mb-4 flex items-center">
            <Icon name="material-symbols:quiz" class="h-5 w-5 mr-2 text-sky-500" />
            Comprehension Questions
            <span class="ml-2 text-sm text-gray-500">(3 questions required)</span>
          </h4>

          <div
            v-for="(question, qIndex) in translation.questions"
            :key="qIndex"
            class="mb-5 p-4 border border-gray-200 rounded-md bg-white shadow-sm"
          >
            <div class="flex items-center justify-between mb-3">
              <label class="block text-sm font-medium text-gray-700">
                Question {{ qIndex + 1 }} <span class="text-red-500">*</span>
              </label>
              <span class="text-xs text-gray-400">{{ question.text.length }} characters</span>
            </div>
            
            <input
              v-model="question.text"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 mb-3"
              :placeholder="`Enter question ${qIndex + 1} in ${getLanguageName(translation.lang)}`"
              required
            />

            <div class="flex items-center space-x-4">
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  :name="'question-' + index + '-' + qIndex"
                  :value="true"
                  v-model="question.answer"
                  class="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300"
                  required
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
                  required
                />
                <span class="ml-2 text-sm text-gray-700">False</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Actions -->
    <div class="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
      <div class="text-sm text-gray-500">
        <span v-if="formValidation.isValid" class="text-green-600">
          ✓ Form is ready to submit
        </span>
        <span v-else class="text-red-600">
          ⚠ Please complete all required fields
        </span>
      </div>
      
      <div class="flex gap-4">
        <NuxtLink
          to="/admin"
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
        >
          Cancel
        </NuxtLink>
        <button
          type="submit"
          class="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="articles.isLoading || !formValidation.isValid"
        >
          <span v-if="articles.isLoading" class="flex items-center">
            <Icon name="svg-spinners:ring-resize" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
            Saving...
          </span>
          <span v-else>{{ submitText }}</span>
        </button>
      </div>
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
      topic: "",
      author: "",
      date: new Date().toISOString().split("T")[0],
      difficulty: "intermediate",
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

const formData = reactive(JSON.parse(JSON.stringify(props.initialData)));
const articles = useArticlesStore();

// Form validation
const formValidation = computed(() => {
  const isValid = 
    formData.topic &&
    formData.author &&
    formData.date &&
    formData.translations.every(translation => 
      translation.title &&
      translation.content &&
      translation.questions.every(q => q.text && q.answer !== null)
    );
  
  return { isValid };
});

// Form progress calculation
const formProgress = computed(() => {
  const totalFields = 3 + (formData.translations.length * 4); // 3 general + 4 per translation
  let completedFields = 0;
  
  if (formData.topic) completedFields++;
  if (formData.author) completedFields++;
  if (formData.date) completedFields++;
  
  formData.translations.forEach(translation => {
    if (translation.title) completedFields++;
    if (translation.content) completedFields++;
    translation.questions.forEach(q => {
      if (q.text) completedFields++;
      if (q.answer !== null) completedFields++;
    });
  });
  
  return Math.round((completedFields / totalFields) * 100);
});

// Language utilities
const getLanguageClass = (lang) => {
  const classes = {
    en: 'bg-blue-100 text-blue-800',
    ar: 'bg-green-100 text-green-800',
    es: 'bg-yellow-100 text-yellow-800',
    fr: 'bg-purple-100 text-purple-800',
    de: 'bg-red-100 text-red-800'
  };
  return classes[lang] || 'bg-gray-100 text-gray-800';
};

const getLanguageName = (lang) => {
  const names = {
    en: 'English',
    ar: 'العربية',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch'
  };
  return names[lang] || lang.toUpperCase();
};

const submitForm = async () => {
  if (!formValidation.value.isValid) {
    return;
  }

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
    console.log("Submitting form with data:", formData.id);

    if (formData.id) {
      await articles.updateArticle(formData.id, articleData);
    } else {
      await articles.createArticle(articleData);
    }
    navigateTo("/admin");
    return true;
  } catch (error) {
    console.error("Error saving article:", error);
    return true;
  }
};
</script>
