<script setup lang="ts">
defineProps<{
  code: string
  flag: string
  name: string
  selected: boolean
}>()

defineEmits<{
  (e: 'select', code: string): void
}>()
</script>

<template>
  <div
    @click="$emit('select', code)"
    :class="{
      'border-sky-500 bg-sky-50': selected,
      'border-gray-200 hover:bg-gray-100': !selected
    }"
    class="bg-white border rounded-lg p-4 text-center cursor-pointer transition-colors"
  >
    <span class="text-2xl mb-2">{{ flag }}</span>
    <p class="font-medium text-gray-800">{{ name }}</p>
  </div>
</template>