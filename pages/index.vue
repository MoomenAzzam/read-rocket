<template>
  <div class="min-h-screen flex flex-col">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-50 to-indigo-100 py-16">
      <div class="container mx-auto px-4 text-center">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Boost Your Reading Speed
            <span class="text-sky-600">Across Languages</span>
          </h1>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Practice speed reading in multiple languages, track your progress, and improve your comprehension skills with our scientifically-designed tests.
          </p>
          
          <!-- Quick Stats -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white rounded-lg p-4 shadow-sm">
              <div class="text-2xl font-bold text-sky-600 mb-1">5</div>
              <div class="text-sm text-gray-600">Languages</div>
            </div>
            <div class="bg-white rounded-lg p-4 shadow-sm">
              <div class="text-2xl font-bold text-green-600 mb-1">3</div>
              <div class="text-sm text-gray-600">Topics</div>
            </div>
            <div class="bg-white rounded-lg p-4 shadow-sm">
              <div class="text-2xl font-bold text-purple-600 mb-1">∞</div>
              <div class="text-sm text-gray-600">Practice Tests</div>
            </div>
          </div>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              @click="showOnboarding = true"
              class="px-8 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Icon name="material-symbols:play-arrow" />
              Get Started
            </button>
            <button
              @click="scrollToTest"
              class="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Icon name="material-symbols:speed" />
              Start Test
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-gray-800 text-center mb-12">How It Works</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="material-symbols:article" class="text-sky-600 text-2xl" />
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">1. Choose Content</h3>
            <p class="text-gray-600">Select from various topics and languages to find content that interests you.</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="material-symbols:schedule" class="text-green-600 text-2xl" />
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">2. Read & Time</h3>
            <p class="text-gray-600">Read the passage at your natural pace while we track your reading time.</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="material-symbols:analytics" class="text-purple-600 text-2xl" />
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">3. Test & Track</h3>
            <p class="text-gray-600">Answer comprehension questions and get detailed performance analytics.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Topic Selection -->
    <section class="py-16 bg-gray-50" ref="testSection">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-gray-800 text-center mb-4">Choose a Topic</h2>
        <p class="text-gray-600 text-center mb-8">Select content that matches your interests and reading level</p>
        
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
      </div>
    </section>

    <!-- Language Selection -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-gray-800 text-center mb-4">Choose a Language</h2>
        <p class="text-gray-600 text-center mb-8">Practice reading in your native language or challenge yourself with new languages</p>
        
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
      </div>
    </section>

    <!-- Start Button -->
    <section class="py-16 bg-gradient-to-r from-sky-50 to-blue-50">
      <div class="container mx-auto px-4 text-center">
        <div class="max-w-2xl mx-auto">
          <h2 class="text-3xl font-bold text-gray-800 mb-4">Ready to Test Your Reading Speed?</h2>
          <p class="text-gray-600 mb-8">
            Select a topic and language above, then click the button below to start your reading test.
          </p>
          
          <button
            @click="startTest"
            :disabled="!selectedTopic || !selectedLanguage"
            :class="{
              'bg-sky-500 hover:bg-sky-600': !!(selectedTopic && selectedLanguage),
              'bg-gray-300 cursor-not-allowed': !selectedTopic || !selectedLanguage,
            }"
            class="px-8 py-4 text-white rounded-lg text-lg font-medium transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <Icon name="material-symbols:play-arrow" />
            Start Reading Test
          </button>
          
          <p v-if="!selectedTopic || !selectedLanguage" class="text-sm text-gray-500 mt-4">
            Please select both a topic and language to begin
          </p>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-gray-800 text-center mb-12">Why Choose ReadRocket?</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Icon name="material-symbols:language" class="text-blue-600 text-xl" />
            </div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Multilingual</h3>
            <p class="text-gray-600 text-sm">Practice reading in 5 different languages</p>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Icon name="material-symbols:analytics" class="text-green-600 text-xl" />
            </div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Track Progress</h3>
            <p class="text-gray-600 text-sm">Monitor your improvement over time</p>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Icon name="material-symbols:psychology" class="text-purple-600 text-xl" />
            </div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Comprehension</h3>
            <p class="text-gray-600 text-sm">Test understanding, not just speed</p>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Icon name="material-symbols:science" class="text-yellow-600 text-xl" />
            </div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Scientifically Designed</h3>
            <p class="text-gray-600 text-sm">Based on proven reading research</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Onboarding Modal -->
    <OnboardingModal 
      :is-visible="showOnboarding"
      @close="showOnboarding = false"
      @complete="handleOnboardingComplete"
    />
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
const showOnboarding = ref(false);
const testSection = ref<HTMLElement | null>(null);

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

const scrollToTest = () => {
  testSection.value?.scrollIntoView({ behavior: 'smooth' });
};

const handleOnboardingComplete = () => {
  showOnboarding.value = false;
  // Optionally scroll to test section after onboarding
  setTimeout(() => {
    scrollToTest();
  }, 500);
};
</script>
