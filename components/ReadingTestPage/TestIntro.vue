<template>
    <div class="bg-white p-8 rounded-xl shadow-md text-center">
      <h2 class="text-xl font-semibold mb-4">
        Ready to begin your speed reading test?
      </h2>
      <p class="text-gray-600 mb-6">
        Read the following passage as quickly as you can while maintaining
        comprehension.
      </p>
      <button
        @click="$emit('start-test')"
        class="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors text-lg"
      >
        Begin Test
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  defineEmits(['start-test']);
  </script>