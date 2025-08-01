<template>
  <div class="max-w-4xl mx-auto">
    <!-- Reading Progress Bar -->
    <div class="mb-6">
      <div class="flex items-center justify-between text-sm text-gray-600 mb-2">
        <span>Reading Progress</span>
        <span>{{ readingProgress }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div 
          class="bg-sky-500 h-2 rounded-full transition-all duration-300"
          :style="{ width: readingProgress + '%' }"
        ></div>
      </div>
    </div>

    <!-- Reading Instructions -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div class="flex items-start gap-3">
        <Icon name="material-symbols:info" class="text-blue-500 text-xl mt-0.5" />
        <div>
          <h3 class="font-semibold text-blue-800 mb-1">Reading Instructions</h3>
          <p class="text-sm text-blue-700">
            Read the passage below at your natural pace. Focus on understanding the content rather than speed. 
            You can scroll to read the entire passage. Click "Finish Reading" when you're done.
          </p>
        </div>
      </div>
    </div>

    <!-- Reading Content -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
      <div class="max-w-3xl mx-auto">
        <!-- Language indicator -->
        <div class="flex items-center gap-2 mb-6">
          <span class="text-sm font-medium text-gray-500">Language:</span>
          <span 
            class="px-3 py-1 text-xs font-medium rounded-full"
            :class="getLanguageClass(lang)"
          >
            {{ getLanguageName(lang) }}
          </span>
        </div>

        <!-- Reading text with enhanced typography -->
        <div 
          ref="readingContent"
          class="prose prose-lg max-w-none"
          :class="getReadingDirection(lang)"
        >
          <div 
            class="text-lg leading-relaxed text-gray-800"
            :style="{ 
              direction: getReadingDirection(lang),
              textAlign: lang === 'ar' ? 'right' : 'left'
            }"
          >
            <div 
              v-for="(paragraph, index) in paragraphs" 
              :key="index"
              class="mb-6"
              :class="{ 'text-right': lang === 'ar' }"
            >
              {{ paragraph }}
            </div>
          </div>
        </div>

        <!-- Reading stats -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <div class="flex flex-wrap gap-6 text-sm text-gray-600">
            <div class="flex items-center gap-2">
              <Icon name="material-symbols:article" class="text-gray-400" />
              <span>{{ wordCount }} words</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="material-symbols:schedule" class="text-gray-400" />
              <span>~{{ estimatedTime }} min read</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="material-symbols:visibility" class="text-gray-400" />
              <span>{{ readingProgress }}% read</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-center gap-4">
      <button
        @click="finishReading"
        class="px-8 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors font-medium flex items-center gap-2"
      >
        <Icon name="material-symbols:check-circle" />
        Finish Reading
      </button>
      
      <button
        @click="showReadingTips"
        class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
      >
        <Icon name="material-symbols:help" />
        Reading Tips
      </button>
    </div>

    <!-- Reading Tips Modal -->
    <Transition name="fade">
      <div
        v-if="showTips"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold text-gray-800">Reading Tips</h3>
            <button
              @click="showTips = false"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Icon name="material-symbols:close" class="text-xl" />
            </button>
          </div>
          
          <div class="space-y-4 text-sm text-gray-600">
            <div class="flex items-start gap-3">
              <Icon name="material-symbols:psychology" class="text-sky-500 mt-0.5" />
              <div>
                <h4 class="font-semibold text-gray-800 mb-1">Focus on Comprehension</h4>
                <p>Read at your natural pace. Speed will come with practice.</p>
              </div>
            </div>
            
            <div class="flex items-start gap-3">
              <Icon name="material-symbols:visibility" class="text-green-500 mt-0.5" />
              <div>
                <h4 class="font-semibold text-gray-800 mb-1">Use Your Eyes</h4>
                <p>Let your eyes move naturally across the text. Don't subvocalize every word.</p>
              </div>
            </div>
            
            <div class="flex items-start gap-3">
              <Icon name="material-symbols:schedule" class="text-purple-500 mt-0.5" />
              <div>
                <h4 class="font-semibold text-gray-800 mb-1">Take Your Time</h4>
                <p>Don't rush. Understanding is more important than speed right now.</p>
              </div>
            </div>
          </div>
          
          <div class="mt-6 pt-4 border-t border-gray-200">
            <button
              @click="showTips = false"
              class="w-full px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  paragraph: {
    type: String,
    required: true
  },
  lang: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['finish-reading']);

const readingContent = ref<HTMLElement | null>(null);
const showTips = ref(false);
const readingProgress = ref(0);

// Split paragraph into smaller chunks for better reading
const paragraphs = computed(() => {
  return props.paragraph.split('\n\n').filter((p: string) => p.trim());
});

// Calculate word count
const wordCount = computed(() => {
  return props.paragraph.split(/\s+/).length;
});

// Estimate reading time (average adult reads 200-250 WPM)
const estimatedTime = computed(() => {
  const minutes = Math.ceil(wordCount.value / 200);
  return minutes;
});

// Track reading progress based on scroll
const updateReadingProgress = () => {
  if (!readingContent.value) return;
  
  const element = readingContent.value;
  const scrollTop = element.scrollTop;
  const scrollHeight = element.scrollHeight;
  const clientHeight = element.clientHeight;
  
  const progress = Math.min(100, Math.max(0, (scrollTop / (scrollHeight - clientHeight)) * 100));
  readingProgress.value = Math.round(progress);
};

// Language utilities
const getLanguageClass = (lang: string) => {
  const classes: Record<string, string> = {
    en: 'bg-blue-100 text-blue-800',
    ar: 'bg-green-100 text-green-800',
    es: 'bg-yellow-100 text-yellow-800',
    fr: 'bg-purple-100 text-purple-800',
    de: 'bg-red-100 text-red-800'
  };
  return classes[lang] || 'bg-gray-100 text-gray-800';
};

const getLanguageName = (lang: string) => {
  const names: Record<string, string> = {
    en: 'English',
    ar: 'العربية',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch'
  };
  return names[lang] || lang.toUpperCase();
};

const getReadingDirection = (lang: string) => {
  return lang === 'ar' ? 'rtl' : 'ltr';
};

const finishReading = () => {
  emit('finish-reading');
};

const showReadingTips = () => {
  showTips.value = true;
};

// Watch for scroll events
onMounted(() => {
  if (readingContent.value) {
    readingContent.value.addEventListener('scroll', updateReadingProgress);
  }
});

onUnmounted(() => {
  if (readingContent.value) {
    readingContent.value.removeEventListener('scroll', updateReadingProgress);
  }
});
</script>

<style scoped>
.prose {
  max-width: none;
}

.prose p {
  margin-bottom: 1.5rem;
  line-height: 1.8;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
