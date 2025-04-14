<template>
  <div class="bg-white p-8 rounded-xl shadow-md text-center">
    <h2 class="text-xl font-semibold mb-4">Reading Completed!</h2>
    <p class="text-gray-600 mb-6">
      You read the passage in {{ formattedTime }}.
    </p>
    <p class="text-gray-600 mb-6">
      Your reading speed: <span class="font-bold">{{ wpm }} WPM</span>
    </p>
    <div class="flex justify-center items-center gap-4">
      <button
        @click="$emit('retry')"
        class="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors text-lg"
      >
        Try Again
      </button>
      <button
        @click="$emit('continue')"
        class="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-lg"
      >
        Continue to Quiz
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { time, wpm } = defineProps({
  time: Number,
  wpm: Number,
});

defineEmits(["retry", "continue"]);

const formattedTime = computed(() => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
});
</script>
