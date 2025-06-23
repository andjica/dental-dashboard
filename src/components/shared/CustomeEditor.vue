<template>
    <!-- TOOLBAR -->
    <div class="flex flex-wrap items-center gap-2 mb-2 text-sm">
          <button
            @click="toggleBold"
            :class="buttonClass(editor.isActive('bold'))"
          >
            B
          </button>
          <button
            @click="toggleItalic"
            :class="buttonClass(editor.isActive('italic'))"
          >
            <em>I</em>
          </button>
          <button
            @click="toggleUnderline"
            :class="buttonClass(editor.isActive('underline'))"
          >
            <u>U</u>
          </button>
          <button
            @click="toggleStrike"
            :class="buttonClass(editor.isActive('strike'))"
          >
            <s>S</s>
          </button>

          <button
            @click="toggleHeading(1)"
            :class="buttonClass(editor.isActive('heading', { level: 1 }))"
          >
            H1
          </button>
          <button
            @click="toggleHeading(2)"
            :class="buttonClass(editor.isActive('heading', { level: 2 }))"
          >
            H2
          </button>

          <button
            @click="toggleBulletList"
            :class="buttonClass(editor.isActive('bulletList'))"
          >
            • List
          </button>
          <button
            @click="toggleOrderedList"
            :class="buttonClass(editor.isActive('orderedList'))"
          >
            1. List
          </button>
        </div>
        <!-- EDITOR -->
        <EditorContent
          :editor="editor"
          class="border rounded p-3 min-h-[150px]"
        />
</template>

<script setup>
import { ref } from "vue";
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Heading from "@tiptap/extension-heading";

const editor = ref(null);

editor.value = new Editor({
  extensions: [
    StarterKit,
    Underline,
    Heading.configure({ levels: [1, 2, 3] }),
  ],
  editorProps: {
    attributes: {
      class: "min-h-[150px] focus:outline-none",
      placeholder: "Write description of product...",
    },
  },
  onUpdate({ editor }) {
    form.value.description = editor.getHTML();
  },
});

const toggleBold = () => editor.value.chain().focus().toggleBold().run();
const toggleItalic = () => editor.value.chain().focus().toggleItalic().run();
const toggleUnderline = () => editor.value.chain().focus().toggleUnderline().run();
const toggleStrike = () => editor.value.chain().focus().toggleStrike().run();

const toggleHeading = (level) =>
  editor.value.chain().focus().toggleHeading({ level }).run();

const toggleBulletList = () =>
  editor.value.chain().focus().toggleBulletList().run();

const toggleOrderedList = () =>
  editor.value.chain().focus().toggleOrderedList().run();

const buttonClass = (isActive) => {
  return `px-2 py-1 rounded border ${
    isActive
      ? 'bg-blue-600 text-white'
      : 'bg-white text-gray-800 hover:bg-gray-100'
  }`;
};

</script>