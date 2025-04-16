<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- Header Section -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">My Profile</h1>
        <p class="text-gray-600">View and manage your account information</p>
      </div>
      <button
        @click="authStore.logout()"
        class="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
      >
        Logout
      </button>
    </div>

    <!-- User Information Card -->
    <div class="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2
        class="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100"
      >
        Personal Information
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1"
            >Full Name</label
          >
          <p class="text-lg font-medium text-gray-800">
            {{ user?.displayName || "Not provided" }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1"
            >Email Address</label
          >
          <p class="text-lg font-medium text-gray-800">{{ user?.email }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1"
            >Account Created</label
          >
          <p class="text-lg font-medium text-gray-800">
            {{ formatDate(user?.metadata?.creationTime) }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1"
            >Last Sign In</label
          >
          <p class="text-lg font-medium text-gray-800">
            {{ formatDate(user?.metadata?.lastSignInTime) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Test Statistics Section -->
    <div class="bg-white rounded-xl shadow-md p-6">
      <h2
        class="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100"
      >
        Reading Test Results
      </h2>

      <div v-if="statistics.length > 0">
        <!-- Summary Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-blue-50 p-4 rounded-lg">
            <p class="text-sm text-blue-600 font-medium">Total Tests</p>
            <p class="text-2xl font-bold text-blue-800">
              {{ statistics.length }}
            </p>
          </div>
          <div class="bg-green-50 p-4 rounded-lg">
            <p class="text-sm text-green-600 font-medium">Avg Comprehension</p>
            <p class="text-2xl font-bold text-green-800">
              {{ calculateAverageComprehension() }}%
            </p>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg">
            <p class="text-sm text-purple-600 font-medium">Avg WPM</p>
            <p class="text-2xl font-bold text-purple-800">
              {{ calculateAverageWPM() }}
            </p>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg">
            <p class="text-sm text-yellow-600 font-medium">Avg Accuracy</p>
            <p class="text-2xl font-bold text-yellow-800">
              {{ calculateAverageAccuracy() }}%
            </p>
          </div>
        </div>

        <!-- Language Distribution -->
        <div class="mb-8">
          <h3 class="text-lg font-medium text-gray-800 mb-4">
            Language Distribution
          </h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(count, lang) in languageDistribution()"
              :key="lang"
              class="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
            >
              {{ lang }}: {{ count }} ({{
                Math.round((count / statistics.length) * 100)
              }}%)
            </span>
          </div>
        </div>

        <!-- Topic Distribution -->
        <div class="mb-8">
          <h3 class="text-lg font-medium text-gray-800 mb-4">
            Topic Distribution
          </h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(count, topic) in topicDistribution()"
              :key="topic"
              class="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
            >
              {{ topic }}: {{ count }} ({{
                Math.round((count / statistics.length) * 100)
              }}%)
            </span>
          </div>
        </div>

        <!-- Test Results Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Language
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Topic
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  WPM
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Comprehension
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Accuracy
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="(test, index) in statistics"
                :key="index"
                class="hover:bg-gray-50"
              >
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {{ test.language.toUpperCase() }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize"
                >
                  {{ test.topic }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span :class="getWPMClass(test.wpm)">
                    {{ test.wpm || "N/A" }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span :class="getComprehensionClass(test.comprehension)">
                    {{ test.comprehension ? `${test.comprehension}%` : "N/A" }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span :class="getAccuracyClass(calculateTestAccuracy(test))">
                    {{ calculateTestAccuracy(test) }}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else class="text-center py-8">
        <div class="mx-auto w-24 h-24 text-gray-400 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-700 mb-1">
          No test results yet
        </h3>
        <p class="text-gray-500">
          Complete your first reading test to see your statistics here.
        </p>
        <button
          @click="navigateTo('/')"
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Take a Test
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
const { $auth } = useNuxtApp();
const authStore = useAuthStore();
const statistics = ref([]);

const user = computed(() => authStore.user);

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Calculate test accuracy based on answers
const calculateTestAccuracy = (test) => {
  if (!test.answers || test.answers.length === 0) return 0;

  const correctAnswers = test.answers.filter(
    (answer) => answer.userAnswer === answer.correct
  ).length;

  return Math.round((correctAnswers / test.answers.length) * 100);
};

// Calculate average comprehension across all tests
const calculateAverageComprehension = () => {
  const validTests = statistics.value.filter(
    (test) => test.comprehension !== null
  );
  if (validTests.length === 0) return 0;

  const total = validTests.reduce((sum, test) => sum + test.comprehension, 0);
  return Math.round(total / validTests.length);
};

// Calculate average WPM across all tests
const calculateAverageWPM = () => {
  const validTests = statistics.value.filter((test) => test.wpm !== null);
  if (validTests.length === 0) return "N/A";

  const total = validTests.reduce((sum, test) => sum + test.wpm, 0);
  return Math.round(total / validTests.length);
};

// Calculate average accuracy across all tests
const calculateAverageAccuracy = () => {
  const validTests = statistics.value.filter(
    (test) => test.answers && test.answers.length > 0
  );
  if (validTests.length === 0) return 0;

  const totalAccuracy = validTests.reduce((sum, test) => {
    return sum + calculateTestAccuracy(test);
  }, 0);

  return Math.round(totalAccuracy / validTests.length);
};

// Calculate language distribution
const languageDistribution = () => {
  const distribution = {};
  statistics.value.forEach((test) => {
    const lang = test.language || "unknown";
    distribution[lang] = (distribution[lang] || 0) + 1;
  });
  return distribution;
};

// Calculate topic distribution
const topicDistribution = () => {
  const distribution = {};
  statistics.value.forEach((test) => {
    const topic = test.topic || "unknown";
    distribution[topic] = (distribution[topic] || 0) + 1;
  });
  return distribution;
};

// Get color class based on WPM value
const getWPMClass = (wpm) => {
  if (!wpm) return "text-gray-500";
  if (wpm > 5000) return "text-green-600 font-bold";
  if (wpm > 3000) return "text-blue-600";
  return "text-yellow-600";
};

// Get color class based on comprehension value
const getComprehensionClass = (comprehension) => {
  if (!comprehension) return "text-gray-500";
  if (comprehension >= 80) return "text-green-600 font-bold";
  if (comprehension >= 60) return "text-blue-600";
  return "text-red-600";
};

// Get color class based on accuracy value
const getAccuracyClass = (accuracy) => {
  if (accuracy >= 90) return "text-green-600 font-bold";
  if (accuracy >= 70) return "text-blue-600";
  return "text-red-600";
};

onMounted(() => {
  const unsubscribe = $auth.onAuthStateChanged((user) => {
    if (!user) {
      navigateTo("/auth");
    }
  });
  onUnmounted(unsubscribe);
});

onMounted(async () => {
  const rawStats = await authStore.getUserTestResults(authStore.user?.uid);
  // Add timestamp if null to maintain consistent data
  statistics.value = rawStats.map((test) => ({
    ...test,
    timestamp: test.timestamp || new Date().toISOString(),
  }));
});
</script>
