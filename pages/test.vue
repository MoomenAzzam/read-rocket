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
          <p class="whitespace-pre-line">{{ testParagraph }}</p>
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
          Calculating your words per minute...{{ wpm }}
        </p>
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

// Mock paragraph data (in a real app, you'd fetch this based on topic/language)
const testParagraph =
  ref(`The ability to read quickly while maintaining comprehension is a valuable skill in today's information-rich world. Speed reading techniques can help you process written material more efficiently, whether you're studying for exams, keeping up with industry news, or simply enjoying a good book. 

The fundamental principle of speed reading is minimizing subvocalization - the tendency to "hear" words in your mind as you read. While this comes naturally to most readers, it limits your reading speed to about the same pace as speaking. By training your eyes to recognize words and phrases without internally vocalizing them, you can significantly increase your reading rate.

Another key technique is expanding your peripheral vision to capture more words at once. Most untrained readers focus on individual words, moving their eyes from word to word. Skilled speed readers take in entire phrases or even full lines with each fixation. This reduces the number of eye movements needed and increases reading speed.

Practice is essential for developing speed reading skills. Start by timing your current reading speed to establish a baseline. Then experiment with different techniques, using a pointer or your finger to guide your eyes. Many people find that moving a pointer slightly faster than their comfortable reading pace helps train their eyes to move more quickly.

It's important to balance speed with comprehension. The goal isn't just to move your eyes faster, but to absorb information efficiently. Regular practice with varied material will help you find the optimal speed for different types of content. Technical material may require slower reading than lighter fiction, for example.

Remember that speed reading is a skill that improves with consistent practice. Don't get discouraged if progress seems slow at first. Over time, you'll develop the ability to adjust your reading speed based on the material and your purpose for reading it. With dedication, you can double or even triple your reading speed while maintaining or even improving comprehension.`);

// Test state
const testStarted = ref(false);
const testFinished = ref(false);
const startTime = ref<Date | null>(null);
const currentTime = ref(0);
const timerInterval = ref<NodeJS.Timeout | null>(null);

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
  console.log(currentTime);

  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }
  testFinished.value = true;
  // Calculate WPM (words per minute)
  const wordCount = testParagraph.value.split(/\s+/).length;
  const minutes = currentTime.value / 60;
  const wpm = Math.round(wordCount / minutes);

  // In a real app, you'd save these results and navigate to results page
  console.log(`Test completed in ${currentTime.value} seconds with ${wpm} WPM`);

  // Navigate to results page
  // navigateTo(`/results?time=${currentTime.value}&wpm=${wpm}`)
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
