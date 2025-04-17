<template>
  <div class="min-h-screen flex flex-col">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-50 to-indigo-100 py-16">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl font-bold text-gray-800 mb-4">
          Boost Your Reading Speed
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Select a topic and language to start your speed-reading test.
        </p>
      </div>
    </section>

    <!-- Topic Selection -->
    <section class="container mx-auto px-4 py-12">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Choose a Topic</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <SelectionCard
          v-for="topic in topics"
          :key="topic.id"
          :id="topic.id"
          :emoji="topic.emoji"
          :title="topic?.name"
          :description="topic.description"
          :selected="selectedTopic === topic.id"
          @select="selectedTopic = $event"
        />
      </div>
    </section>

    <!-- Language Selection -->
    <section class="container mx-auto px-4 py-12 bg-gray-50 rounded-xl">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Choose a Language</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <LanguageCard
          v-for="lang in languages"
          :key="lang.code"
          :code="lang.code"
          :flag="lang.flag"
          :name="lang?.name"
          :selected="selectedLanguage === lang.code"
          @select="selectedLanguage = $event"
        />
      </div>
    </section>

    <!-- Start Button -->
    <section class="container mx-auto px-4 py-12 text-center">
      <button
        @click="startTest"
        :disabled="!selectedTopic || !selectedLanguage"
        :class="{
          'bg-sky-500 hover:bg-sky-600': !!(selectedTopic && selectedLanguage),
          'bg-gray-300 cursor-not-allowed': !selectedTopic || !selectedLanguage,
        }"
        class="px-8 py-3 text-white rounded-lg text-lg font-medium transition-colors"
      >
        Start Reading Test
      </button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
// Mock data - replace with real data fetching
const topics = ref([
  {
    id: "technology",
    name: "Technology",
    emoji: "💻",
    description: "Articles on AI, programming, and gadgets",
  },
  {
    id: "science",
    name: "Science",
    emoji: "🔬",
    description: "Discoveries, space, and physics",
  },
  {
    id: "business",
    name: "Business",
    emoji: "📈",
    description: "Finance, startups, and markets",
  },
]);

const languages = ref([
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
]);

// State
const selectedTopic = ref<string | null>(null);
const selectedLanguage = ref<string | null>(null);

// Methods
const handleLogin = () => {
  navigateTo("/auth");
};

const startTest = () => {
  if (selectedTopic.value && selectedLanguage.value) {
    navigateTo(
      `/test?topic=${selectedTopic.value}&lang=${selectedLanguage.value}`
    );
  }
};

</script>
