<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
  >
    <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-800">Welcome to ReadRocket! 🚀</h2>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Icon name="material-symbols:close" class="text-2xl" />
          </button>
        </div>
        <p class="text-gray-600 mt-2">Let's get you started with speed reading</p>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div v-if="currentStep === 1" class="space-y-6">
          <div class="text-center">
            <div class="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="material-symbols:psychology" class="text-3xl text-sky-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">What is Speed Reading?</h3>
            <p class="text-gray-600">
              Speed reading is a technique to read faster while maintaining comprehension. 
              Our app helps you practice and track your progress across different languages.
            </p>
          </div>
          
          <div class="bg-blue-50 p-4 rounded-lg">
            <h4 class="font-semibold text-blue-800 mb-2">Key Metrics:</h4>
            <ul class="text-sm text-blue-700 space-y-1">
              <li>• <strong>WPM:</strong> Words Per Minute - your reading speed</li>
              <li>• <strong>Comprehension:</strong> How well you understand the content</li>
              <li>• <strong>Accuracy:</strong> How many quiz questions you answer correctly</li>
            </ul>
          </div>
        </div>

        <div v-else-if="currentStep === 2" class="space-y-6">
          <div class="text-center">
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="material-symbols:timeline" class="text-3xl text-green-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">How the Test Works</h3>
            <p class="text-gray-600">
              Each test consists of reading a passage and answering comprehension questions.
            </p>
          </div>
          
          <div class="space-y-4">
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <h4 class="font-semibold text-gray-800">Read the Passage</h4>
                <p class="text-sm text-gray-600">Take your time to read the content thoroughly</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <h4 class="font-semibold text-gray-800">Answer Questions</h4>
                <p class="text-sm text-gray-600">Test your comprehension with true/false questions</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <h4 class="font-semibold text-gray-800">Review Results</h4>
                <p class="text-sm text-gray-600">See your WPM, comprehension, and accuracy scores</p>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="currentStep === 3" class="space-y-6">
          <div class="text-center">
            <div class="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="material-symbols:trending-up" class="text-3xl text-purple-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Tips for Success</h3>
            <p class="text-gray-600">
              Follow these tips to improve your speed reading skills:
            </p>
          </div>
          
          <div class="space-y-4">
            <div class="bg-yellow-50 p-4 rounded-lg">
              <h4 class="font-semibold text-yellow-800 mb-2">💡 Reading Tips:</h4>
              <ul class="text-sm text-yellow-700 space-y-1">
                <li>• Focus on the content, not the timer</li>
                <li>• Read at your natural pace first</li>
                <li>• Practice regularly to see improvement</li>
                <li>• Don't skip words - maintain comprehension</li>
              </ul>
            </div>
            
            <div class="bg-green-50 p-4 rounded-lg">
              <h4 class="font-semibold text-green-800 mb-2">🎯 Goal Setting:</h4>
              <ul class="text-sm text-green-700 space-y-1">
                <li>• Start with familiar languages</li>
                <li>• Aim for 80%+ comprehension</li>
                <li>• Gradually increase speed over time</li>
                <li>• Track your progress in your profile</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-6 border-t border-gray-200 flex justify-between">
        <button
          v-if="currentStep > 1"
          @click="previousStep"
          class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          Previous
        </button>
        <div v-else></div>
        
        <button
          v-if="currentStep < 3"
          @click="nextStep"
          class="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
        >
          Next
        </button>
        <button
          v-else
          @click="completeOnboarding"
          class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Get Started!
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'complete']);

const currentStep = ref(1);

const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++;
  }
};

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const closeModal = () => {
  emit('close');
};

const completeOnboarding = () => {
  emit('complete');
  closeModal();
};
</script> 