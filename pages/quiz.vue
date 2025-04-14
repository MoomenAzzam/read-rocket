<script setup lang="ts">
import { ref, computed } from "vue";
const authStore = useAuthStore();
// Mock user - replace with real auth
const user = computed(() => authStore.user);

// Questions data
const questions = ref([
  {
    id: 1,
    text: "Speed reading techniques can help you process written material more efficiently.",
    answer: true,
    userAnswer: null as boolean | null,
    correct: null as boolean | null,
  },
  {
    id: 2,
    text: "Subvocalization increases your reading speed significantly.",
    answer: false,
    userAnswer: null as boolean | null,
    correct: null as boolean | null,
  },
  {
    id: 3,
    text: "Technical material may require slower reading than lighter fiction.",
    answer: true,
    userAnswer: null as boolean | null,
    correct: null as boolean | null,
  },
]);

// Test results
const route = useRoute();
const wpm = ref(Number(route.query.wpm) || 0);

// const wpm = ref(250) // Would come from route params in real app
const submitted = ref(false);
const showLoginPrompt = ref(false);

// Calculate comprehension percentage
const comprehensionPercentage = computed(() => {
  if (!submitted.value) return 0;
  const correctCount = questions.value.filter((q) => q.correct).length;
  return Math.round((correctCount / questions.value.length) * 100);
});

// Handle answer selection
const selectAnswer = (questionId: number, answer: boolean) => {
  if (submitted.value) return;

  const question = questions.value.find((q) => q.id === questionId);
  if (question) {
    question.userAnswer = answer;
  }
};

// Submit answers
const submitAnswers = () => {
  // Mark which answers are correct
  questions.value.forEach((q) => {
    q.correct = q.userAnswer === q.answer;
  });

  submitted.value = true;

  // Show login prompt if not logged in
  if (!user.value) {
    showLoginPrompt.value = true;
  }
};

// Save results (would connect to Firebase in real app)
const saveResults = () => {
  navigateTo("/");
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-2xl">
      <!-- Test Header -->
      <div class="mb-8 text-center">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">
          Comprehension Test
        </h1>
        <p class="text-gray-600">
          Answer the questions about the text you just read
        </p>
      </div>

      <!-- Questions -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div
          v-for="question in questions"
          :key="question.id"
          class="p-6 border-b border-gray-200 last:border-b-0"
          :class="{
            'bg-green-50': submitted && question.correct,
            'bg-red-50': submitted && question.correct === false,
          }"
        >
          <h3 class="text-lg font-medium text-gray-800 mb-4">
            {{ question.text }}
          </h3>
          <div class="flex space-x-4">
            <button
              @click="selectAnswer(question.id, true)"
              :disabled="submitted"
              :class="{
                'bg-green-100 border-green-500':
                  submitted && question.answer === true,
                'border-gray-300': !(submitted && question.answer === true),
                'bg-blue-50 border-blue-500':
                  question.userAnswer === true && !submitted,
              }"
              class="px-4 py-2 border rounded-lg flex-1"
            >
              True
            </button>
            <button
              @click="selectAnswer(question.id, false)"
              :disabled="submitted"
              :class="{
                'bg-green-100 border-green-500':
                  submitted && question.answer === false,
                'border-gray-300': !(submitted && question.answer === false),
                'bg-blue-50 border-blue-500':
                  question.userAnswer === false && !submitted,
              }"
              class="px-4 py-2 border rounded-lg flex-1"
            >
              False
            </button>
          </div>

          <!-- Explanation (shown after submission) -->
          <div
            v-if="submitted && question.correct === false"
            class="mt-3 text-sm text-red-600"
          >
            Correct answer: {{ question.answer ? "True" : "False" }}
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="text-center mb-8" v-if="!submitted">
        <button
          @click="submitAnswers"
          :disabled="questions.some((q) => q.userAnswer === null)"
          class="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors text-lg disabled:opacity-50"
        >
          Submit Answers
        </button>
      </div>

      <!-- Results -->
      <div v-if="submitted" class="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 class="text-xl font-bold text-gray-800 mb-4 text-center">
          Your Results
        </h2>

        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="bg-blue-50 p-4 rounded-lg text-center">
            <p class="text-sm text-gray-600">Reading Speed</p>
            <p class="text-2xl font-bold text-blue-600">{{ wpm }} WPM</p>
          </div>
          <div class="bg-blue-50 p-4 rounded-lg text-center">
            <p class="text-sm text-gray-600">Comprehension</p>
            <p class="text-2xl font-bold text-blue-600">
              {{ comprehensionPercentage }}%
            </p>
          </div>
        </div>

        <!-- Login Prompt -->
        <div
          v-if="showLoginPrompt"
          class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6"
        >
          <div class="flex">
            <div class="flex-shrink-0">
              <svg
                class="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-yellow-700">
                Login to save your results and track your progress!
              </p>
            </div>
          </div>

          <div class="mt-4 flex space-x-3">
            <button
              @click="
                showLoginPrompt = false;
                navigateTo('/auth');
              "
              class="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
            >
              Login
            </button>
            <button
              @click="showLoginPrompt = false"
              class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Continue as Guest
            </button>
          </div>
        </div>

        <!-- Previous Results (for logged in users) -->
        <div v-if="user" class="mt-6">
          <h3 class="text-lg font-medium text-gray-800 mb-3">
            Your Previous Results
          </h3>
          <div class="space-y-3">
            <div
              v-for="(result, index) in 3"
              :key="index"
              class="bg-gray-50 p-3 rounded-lg flex justify-between items-center"
            >
              <div>
                <p class="font-medium">Test {{ index + 1 }}</p>
                <p class="text-sm text-gray-600">
                  {{ 250 + index * 20 }} WPM • {{ 70 + index * 10 }}%
                  comprehension
                </p>
              </div>
              <span class="text-sm text-gray-500">2 days ago</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex space-x-3 mt-6">
          <button
            @click="saveResults"
            class="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors flex-1"
          >
            Save Results
          </button>
          <button
            @click="navigateTo('/')"
            class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex-1"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
