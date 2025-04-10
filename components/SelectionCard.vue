<script setup lang="ts">
defineProps<{
  id: string | number
  emoji?: string
  title: string
  description?: string
  selected: boolean
}>()

defineEmits<{
  (e: 'select', id: string | number): void
}>()
</script>

<template>
  <div
    @click="$emit('select', id)"
    :class="{
      'border-sky-500 ring-2 ring-sky-200': selected,
      'border-gray-200 hover:border-sky-300': !selected
    }"
    class="bg-white border rounded-xl p-6 cursor-pointer transition-all"
  >
    <div v-if="emoji" class="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mb-4">
      <span class="text-sky-600 text-xl">{{ emoji }}</span>
    </div>
    <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ title }}</h3>
    <p v-if="description" class="text-gray-600">{{ description }}</p>
  </div>
</template>