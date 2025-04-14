<template>
  <div class="bg-white p-8 rounded-xl shadow-md">
    <div class="prose max-w-none mb-8">
      <p class="whitespace-pre-line text-xl">{{ paragraph }}</p>
    </div>

    <div class="text-center">
      <button
        @click="$emit('finish-reading')"
        class="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors text-lg"
      >
        Finish Reading
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  paragraph: {
    type: String,
    required: true,
  },
});

defineEmits(["finish-reading"]);
</script>
