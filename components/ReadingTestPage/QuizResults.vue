<template>
  <div class="max-w-4xl mx-auto">
    <!-- Results Header -->
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-2">Test Complete! 🎉</h2>
      <p class="text-gray-600">Here's how you performed on your reading test</p>
    </div>

    <!-- Performance Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- WPM Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-800">Reading Speed</h3>
          <Icon name="material-symbols:speed" class="text-sky-500 text-xl" />
        </div>
                 <div class="text-center">
           <div class="text-3xl font-bold text-sky-600 mb-2">{{ props.wpm }}</div>
           <div class="text-sm text-gray-600">Words Per Minute</div>
           <div class="mt-3">
             <span :class="getWPMBadgeClass(props.wpm)" class="px-3 py-1 text-xs font-medium rounded-full">
               {{ getWPMLevel(props.wpm) }}
             </span>
           </div>
         </div>
      </div>

      <!-- Comprehension Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-800">Comprehension</h3>
          <Icon name="material-symbols:psychology" class="text-green-500 text-xl" />
        </div>
                 <div class="text-center">
           <div class="text-3xl font-bold text-green-600 mb-2">{{ props.comprehension }}%</div>
           <div class="text-sm text-gray-600">Understanding Score</div>
           <div class="mt-3">
             <span :class="getComprehensionBadgeClass(props.comprehension)" class="px-3 py-1 text-xs font-medium rounded-full">
               {{ getComprehensionLevel(props.comprehension) }}
             </span>
           </div>
         </div>
      </div>

      <!-- Overall Score Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-800">Overall Score</h3>
          <Icon name="material-symbols:star" class="text-yellow-500 text-xl" />
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-yellow-600 mb-2">{{ overallScore }}</div>
          <div class="text-sm text-gray-600">Performance Rating</div>
          <div class="mt-3">
            <span :class="getOverallBadgeClass(overallScore)" class="px-3 py-1 text-xs font-medium rounded-full">
              {{ getOverallLevel(overallScore) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Results -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">Question Analysis</h3>
      
      <div class="space-y-4">
        <div 
          v-for="(question, index) in props.questions" 
          :key="index"
          class="p-4 rounded-lg border"
          :class="question.correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'"
        >
          <div class="flex items-start gap-3">
            <div 
              class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              :class="question.correct ? 'bg-green-500 text-white' : 'bg-red-500 text-white'"
            >
              {{ index + 1 }}
            </div>
            <div class="flex-1">
              <p class="text-gray-800 mb-2">{{ question.text }}</p>
              <div class="flex items-center gap-4 text-sm">
                <span class="text-gray-600">Your answer: <strong>{{ question.userAnswer ? 'True' : 'False' }}</strong></span>
                <span class="text-gray-600">Correct answer: <strong>{{ question.answer ? 'True' : 'False' }}</strong></span>
                <span 
                  :class="question.correct ? 'text-green-600' : 'text-red-600'"
                  class="font-medium"
                >
                  {{ question.correct ? '✓ Correct' : '✗ Incorrect' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Performance Insights -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Icon name="material-symbols:insights" class="text-blue-500 mr-2" />
        Performance Insights
      </h3>
      
      <div class="space-y-3 text-sm text-gray-700">
        <div v-if="props.wpm < 200" class="flex items-start gap-2">
          <Icon name="material-symbols:info" class="text-blue-500 mt-0.5" />
          <p>Your reading speed is below average. Consider practicing with shorter texts and gradually increasing complexity.</p>
        </div>
        <div v-else-if="props.wpm > 400" class="flex items-start gap-2">
          <Icon name="material-symbols:celebration" class="text-green-500 mt-0.5" />
          <p>Excellent reading speed! You're reading faster than most adults. Focus on maintaining comprehension at this pace.</p>
        </div>
        
        <div v-if="props.comprehension < 60" class="flex items-start gap-2">
          <Icon name="material-symbols:warning" class="text-yellow-500 mt-0.5" />
          <p>Your comprehension could be improved. Try reading more slowly and focusing on understanding rather than speed.</p>
        </div>
        <div v-else-if="props.comprehension > 80" class="flex items-start gap-2">
          <Icon name="material-symbols:check-circle" class="text-green-500 mt-0.5" />
          <p>Great comprehension! You're understanding the material well. Consider challenging yourself with more complex texts.</p>
        </div>
        
        <div class="flex items-start gap-2">
          <Icon name="material-symbols:trending-up" class="text-purple-500 mt-0.5" />
          <p>Regular practice will help improve both your speed and comprehension. Try different topics and languages to build your skills.</p>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        @click="$emit('save-results')"
        class="px-8 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors font-medium flex items-center justify-center gap-2"
      >
        <Icon name="material-symbols:save" />
        Save Results
      </button>
      
      <button
        @click="$emit('retry')"
        class="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
      >
        <Icon name="material-symbols:refresh" />
        Try Again
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
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

const emit = defineEmits(['save-results', 'retry']);

// Calculate overall score (weighted average of WPM and comprehension)
const overallScore = computed(() => {
  const wpmScore = Math.min(props.wpm / 400 * 100, 100); // Normalize WPM to 0-100
  const comprehensionScore = props.comprehension;
  return Math.round((wpmScore * 0.4) + (comprehensionScore * 0.6));
});

// WPM level assessment
const getWPMLevel = (wpm) => {
  if (wpm < 150) return 'Slow';
  if (wpm < 250) return 'Average';
  if (wpm < 350) return 'Good';
  if (wpm < 450) return 'Fast';
  return 'Very Fast';
};

const getWPMBadgeClass = (wpm) => {
  if (wpm < 150) return 'bg-red-100 text-red-800';
  if (wpm < 250) return 'bg-yellow-100 text-yellow-800';
  if (wpm < 350) return 'bg-blue-100 text-blue-800';
  if (wpm < 450) return 'bg-green-100 text-green-800';
  return 'bg-purple-100 text-purple-800';
};

// Comprehension level assessment
const getComprehensionLevel = (comprehension) => {
  if (comprehension < 50) return 'Poor';
  if (comprehension < 70) return 'Fair';
  if (comprehension < 85) return 'Good';
  if (comprehension < 95) return 'Very Good';
  return 'Excellent';
};

const getComprehensionBadgeClass = (comprehension) => {
  if (comprehension < 50) return 'bg-red-100 text-red-800';
  if (comprehension < 70) return 'bg-yellow-100 text-yellow-800';
  if (comprehension < 85) return 'bg-blue-100 text-blue-800';
  if (comprehension < 95) return 'bg-green-100 text-green-800';
  return 'bg-purple-100 text-purple-800';
};

// Overall performance level
const getOverallLevel = (score) => {
  if (score < 40) return 'Needs Work';
  if (score < 60) return 'Developing';
  if (score < 80) return 'Good';
  if (score < 90) return 'Very Good';
  return 'Excellent';
};

const getOverallBadgeClass = (score) => {
  if (score < 40) return 'bg-red-100 text-red-800';
  if (score < 60) return 'bg-yellow-100 text-yellow-800';
  if (score < 80) return 'bg-blue-100 text-blue-800';
  if (score < 90) return 'bg-green-100 text-green-800';
  return 'bg-purple-100 text-purple-800';
};
</script>