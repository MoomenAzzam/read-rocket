<!-- components/editor/Tiptap.vue -->
<template>
    <div v-if="editor" class="border rounded p-2 min-h-48">
      <div class="flex flex-wrap gap-1 mb-2">
        <button
          @click="editor.chain().focus().toggleBold().run()"
          :class="{ 'bg-sky-100': editor.isActive('bold') }"
          class="p-2 rounded hover:bg-sky-50"
        >
          Bold
        </button>
        <!-- Add more formatting buttons as needed -->
      </div>
      <!-- <EditorContent :editor="editor" class="prose max-w-none" /> -->
    </div>
  </template>
  
  <script setup>
  
  const props = defineProps({
    modelValue: {
      type: String,
      default: ''
    }
  })
  
  const emit = defineEmits(['update:modelValue'])
  

  
  watch(() => props.modelValue, (value) => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  })
  
  onBeforeUnmount(() => {
    editor.destroy()
  })
  </script>