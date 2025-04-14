<template>
    <div class="bg-white rounded-xl shadow-md p-6">
      <h2 class="text-xl font-bold text-gray-800 mb-4 text-center">
        Your Final Results
      </h2>
  
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="bg-blue-50 p-4 rounded-lg text-center">
          <p class="text-sm text-gray-600">Reading Speed</p>
          <p class="text-2xl font-bold text-blue-600">{{ wpm }} WPM</p>
        </div>
        <div class="bg-blue-50 p-4 rounded-lg text-center">
          <p class="text-sm text-gray-600">Comprehension</p>
          <p class="text-2xl font-bold text-blue-600">{{ comprehension }}%</p>
        </div>
      </div>
  
      <!-- Questions Review -->
      <div class="mb-8">
        <h3 class="text-lg font-medium text-gray-800 mb-3">Questions Review</h3>
        <div 
          v-for="(question, index) in questions"
          :key="question.id"
          class="mb-4 p-4 rounded-lg"
          :class="{
            'bg-green-50': question.correct,
            'bg-red-50': !question.correct
          }"
        >
          <p class="font-medium">
            {{ index + 1 }}. {{ question.text }}
          </p>
          <p class="mt-2">
            Your answer: <span :class="question.correct ? 'text-green-600' : 'text-red-600'">
              {{ question.userAnswer ? 'True' : 'False' }}
            </span>
          </p>
          <p v-if="!question.correct" class="text-sm mt-1">
            Correct answer: {{ question.answer ? 'True' : 'False' }}
          </p>
        </div>
      </div>
  
      <!-- Action Buttons -->
      <div class="flex space-x-3">
        <button
          @click="$emit('save-results')"
          class="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors flex-1"
        >
          Save Results
        </button>
        <button
          @click="$emit('retry')"
          class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex-1"
        >
          Try Again
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps({
    wpm: {
      type: Number,
      required: true
    },
    comprehension: {
      type: Number,
      required: true
    },
    questions: {
      type: Array,
      required: true
    }
  });
  
  defineEmits(['save-results', 'retry']);
  </script>