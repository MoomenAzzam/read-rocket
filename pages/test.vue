<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <!-- Header with timer -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold text-gray-800">Reading Test</h1>
        <div class="text-xl font-mono bg-white px-4 py-2 rounded-lg shadow-sm">
          {{ formattedTime }}
        </div>
      </div>

      <!-- Test content -->
      <div
        v-if="!testStarted"
        class="bg-white p-8 rounded-xl shadow-md text-center"
      >
        <h2 class="text-xl font-semibold mb-4">
          Ready to begin your speed reading test?
        </h2>
        <p class="text-gray-600 mb-6">
          Read the following passage as quickly as you can while maintaining
          comprehension.
        </p>
        <button
          @click="startTest"
          class="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors text-lg"
        >
          Begin Test
        </button>
      </div>
      <!-- Reading content -->
      <div v-else-if="!testFinished" class="bg-white p-8 rounded-xl shadow-md">
        <div class="prose max-w-none mb-8">
          <p class="whitespace-pre-line text-xl">{{ testParagraph }}</p>
        </div>

        <div class="text-center">
          <button
            @click="finishTest"
            class="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors text-lg"
          >
            Finish Test
          </button>
        </div>
      </div>

      <!-- Results placeholder (in real app this would be a separate page) -->
      <div v-else class="bg-white p-8 rounded-xl shadow-md text-center">
        <h2 class="text-xl font-semibold mb-4">Test Completed!</h2>
        <p class="text-gray-600 mb-6">
          You read the passage in {{ formattedTime }}.
        </p>
        <p class="text-gray-600 mb-6">
          Calculating your words per minute is: {{ wpm }}
        </p>
        <div class="flex justify-center items-center gap-4">
          <button
            @click="
              testFinished = false;
              testStarted = false;
              currentTime = 0;
            "
            class="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors text-lg"
          >
            Try Again
          </button>
          <button
            @click="goToQuestionsPage"
            class="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-lg"
          >
            Go To Quiz
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

const articles = useArticlesStore();

const route = useRoute();
const topic = route.query.topic;
const lang = route.query.lang;

// Mock paragraph data (in a real app, you'd fetch this based on topic/language)
const testParagraph = ref(``);

onMounted(() => {
  // const content = data.topics[topic].articles[0].translations.filter(
  //   (obj) => obj.lang == lang
  // );
  // testParagraph.value = content[0].content;
});

onMounted(async () => {
  const results = await articles.fetchRandomArticleByTopic(topic, lang);
  console.log("results", results);
  testParagraph.value = results.content;
});

// Test state
const testStarted = ref(false);
const testFinished = ref(false);
const startTime = ref<Date | null>(null);
const currentTime = ref(0);
const timerInterval = ref<NodeJS.Timeout | null>(null);
const wpm = ref(0);
// Start the test
const startTest = () => {
  testStarted.value = true;
  startTime.value = new Date();
  timerInterval.value = setInterval(() => {
    currentTime.value = Math.floor(
      (new Date().getTime() - (startTime.value?.getTime() || 0)) / 1000
    );
  }, 100);
};

// Finish the test
const finishTest = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }
  testFinished.value = true;
  // Calculate WPM (words per minute)
  const wordCount = testParagraph.value.split(/\s+/).length;
  const minutes = currentTime.value / 60;
  wpm.value = Math.round(wordCount / minutes);

  // Navigate to results page
  // navigateTo(`/results?time=${currentTime.value}&wpm=${wpm}`)
};

const goToQuestionsPage = () => {
  navigateTo(`/quiz?time=${currentTime.value}&wpm=${wpm.value}`);
};

// Format time for display
const formattedTime = computed(() => {
  const minutes = Math.floor(currentTime.value / 60);
  const seconds = Math.floor(currentTime.value % 60);
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
});

// Clean up timer on unmount
onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }
});
</script>
