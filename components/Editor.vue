<template>
  <div>
    <TiptapBubbleMenu :editor="editor" />
    <TiptapContent :editor="editor" />
  </div>
</template>

<script setup>
import { useEditor, BubbleMenu, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";

const editor = useEditor({
  content: "<p>ابدأ الكتابة هنا...</p>",
  extensions: [StarterKit],
});
</script>
