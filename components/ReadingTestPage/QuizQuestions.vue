<template>
    <div class="bg-white rounded-xl shadow-md overflow-hidden mb-8">
      <div class="p-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-2 text-center">
          Comprehension Test
        </h1>
        <p class="text-gray-600 text-center mb-6">
          Answer the questions about the text you just read
        </p>
        
        <div 
          v-for="(question, index) in questions"
          :key="question.id"
          class="mb-6 p-4 border border-gray-200 rounded-lg"
        >
          <h3 class="text-lg font-medium text-gray-800 mb-3">
            {{ index + 1 }}. {{ question.text }}
          </h3>
          <div class="flex space-x-4">
            <button
              @click="selectAnswer(index, true)"
              :class="{
                'bg-blue-50 border-blue-500': userAnswers[index] === true,
                'border-gray-300': userAnswers[index] !== true
              }"
              class="px-4 py-2 border rounded-lg flex-1"
            >
              True
            </button>
            <button
              @click="selectAnswer(index, false)"
              :class="{
                'bg-blue-50 border-blue-500': userAnswers[index] === false,
                'border-gray-300': userAnswers[index] !== false
              }"
              class="px-4 py-2 border rounded-lg flex-1"
            >
              False
            </button>
          </div>
        </div>
        
        <div class="text-center">
          <button
            @click="submit"
            :disabled="!allQuestionsAnswered"
            class="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors text-lg disabled:opacity-50"
          >
            Submit Answers
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  
  const props = defineProps({
    questions: {
      type: Array,
      required: true
    }
  });
  
  const emit = defineEmits(['submit-answers']);
  
  const userAnswers = ref(props.questions.map(() => null));
  
  const allQuestionsAnswered = computed(() => {
    return userAnswers.value.every(answer => answer !== null);
  });
  
  const selectAnswer = (index, answer) => {
    userAnswers.value[index] = answer;
  };
  
  const submit = () => {
    emit('submit-answers', userAnswers.value);
  };
  </script>