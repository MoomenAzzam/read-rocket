<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <!-- Header with timer -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold text-gray-800">Reading Test</h1>
        <div
          v-if="currentStage === 'reading'"
          class="text-xl font-mono bg-white px-4 py-2 rounded-lg shadow-sm"
        >
          {{ formattedTime }}
        </div>
      </div>

      <!-- Dynamic components based on test state -->
      <TestIntro v-if="currentStage === 'intro'" @start-test="startTest" />

      <TestContent
        v-else-if="currentStage === 'reading'"
        :paragraph="testParagraph"
        :lang="route.query.lang"
        @finish-reading="finishReading"
      />
      <TestResults
        v-else-if="currentStage === 'reading-results'"
        :time="currentTime"
        :wpm="wpm"
        @retry="resetTest"
        @continue="startQuiz"
      />

      <QuizQuestions
        v-else-if="currentStage === 'quiz'"
        :questions="questions"
        @submit-answers="submitAnswers"
      />

      <QuizResults
        v-else-if="currentStage === 'quiz-results'"
        :wpm="wpm"
        :comprehension="comprehensionPercentage"
        :questions="questions"
        @save-results="saveResults"
        @retry="resetTest"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useArticlesStore } from "@/stores/articles";
import { useAuthStore } from "@/stores/auth";

// Components
import TestIntro from "@/components/ReadingTestPage/TestIntro.vue";
import TestContent from "@/components/ReadingTestPage/TestContent.vue";
import TestResults from "@/components/ReadingTestPage/TestResults.vue";
import QuizQuestions from "@/components/ReadingTestPage/QuizQuestions.vue";
import QuizResults from "@/components/ReadingTestPage/QuizResults.vue";

const articles = useArticlesStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

// Test data
const testParagraph = ref("");
const questions = ref([]);
const currentStage = ref("intro"); // intro, reading, reading-results, quiz, quiz-results

// Timer related
const startTime = ref<Date | null>(null);
const currentTime = ref(0);
const timerInterval = ref<NodeJS.Timeout | null>(null);
const wpm = ref(0);

// Fetch article based on topic and language
onMounted(async () => {
  if (!route.query.topic || !route.query.lang) {
    router.push("/");
    return;
  }
  const results = await articles.fetchRandomArticleByTopic(
    route.query.topic,
    route.query.lang
  );
  testParagraph.value = results?.content;
  questions.value = results?.questions || [];
});

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    await authStore.signInAnonymously();
  }
});

// Start the reading test
const startTest = () => {
  currentStage.value = "reading";
  startTime.value = new Date();
  timerInterval.value = setInterval(() => {
    currentTime.value = Math.floor(
      (new Date().getTime() - (startTime.value?.getTime() || 0)) / 1000
    );
  }, 100);
};

// Finish reading and show results
const finishReading = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }

  // Calculate WPM
  const wordCount = testParagraph.value.split(/\s+/).length;
  const minutes = currentTime.value / 60;
  wpm.value = Math.round(wordCount / minutes);

  currentStage.value = "reading-results";
};

// Start the quiz
const startQuiz = () => {
  currentStage.value = "quiz";
};

// Submit quiz answers
const submitAnswers = (userAnswers) => {
  // Mark which answers are correct
  questions.value.forEach((q, index) => {
    q.userAnswer = userAnswers[index];
    q.correct = q.userAnswer === q.answer;
  });

  currentStage.value = "quiz-results";
};

// Calculate comprehension percentage
const comprehensionPercentage = computed(() => {
  if (currentStage.value !== "quiz-results") return 0;
  const correctCount = questions.value.filter((q) => q.correct).length;
  return Math.round((correctCount / questions.value.length) * 100);
});

const saveResults = async () => {
  if (!authStore.user) {
    router.push("/");
  }


  // Ensure required fields have values
  const testResults = {
    userId: authStore.user.uid,
    topic: route.query.topic || "unknown", // provide default if undefined
    language: route.query.lang || "unknown", // provide default if undefined
    wpm: wpm.value,
    comprehension: comprehensionPercentage.value,
    answers: questions.value.map((q) => ({
      userAnswer: q.userAnswer,
      correct: q.correct,
    })),
  };

  // Save to Firestore
  await articles.saveTestResults(testResults);

  router.push("/");
};

// Reset the test
const resetTest = () => {
  currentStage.value = "intro";
  currentTime.value = 0;
  startTime.value = null;
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
    timerInterval.value = null;
  }
};

// Format time for display
const formattedTime = computed(() => {
  const minutes = Math.floor(currentTime.value / 60);
  const seconds = Math.floor(currentTime.value % 60);
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
});

// Clean up
onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }
});
</script>
