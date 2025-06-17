<!-- eslint-disable vue/no-v-html -->
<!-- stolen from the Drop OSS project lol -->
<template>
  <div class="mt-1 flex flex-col gap-4">
    <!-- Markdown shortcuts -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="shortcut in markdownShortcuts"
        :key="shortcut.label"
        type="button"
        class="px-2 py-1 text-sm rounded bg-zinc-100 text-zinc-900 hover:bg-zinc-700 transition-colors"
        @click="applyMarkdown(shortcut)"
      >
        {{ shortcut.label }}
      </button>
    </div>

    <div class="grid grid-rows-2 sm:grid-cols-2 sm:grid-rows-1 gap-4 h-[400px]">
      <!-- Editor -->
      <div class="flex flex-col">
        <span class="text-sm text-zinc-500 mb-2">Editor</span>
        <textarea
          id="content"
          ref="contentEditor"
          v-model="model"
          class="flex-1 px-2 py-1 rounded-md bg-white border border-zinc-300 text-zinc-900 focus:border-blue-500 focus:ring-blue-500 font-mono resize-none"
          required
          @keydown="handleContentKeydown"
        />
      </div>

      <!-- Preview -->
      <div class="flex flex-col">
        <span class="text-sm text-zinc-500 mb-2">Preview</span>
        <div
          class="flex-1 p-4 rounded-md bg-white border border-zinc-300 overflow-y-auto"
        >
          <div
            class="prose prose-blue prose-sm h-full overflow-y-auto"
            v-html="markdownPreview"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { micromark } from "micromark";
import DOMPurify from "dompurify";

const model = defineModel<string>();

const markdownPreview = computed(() => {
  // TODO: maybe?? add https://github.com/cure53/DOMPurify
  // micromark says its safe, but this is straight html we are injecting
  return DOMPurify.sanitize(micromark(model.value ?? ""));
});

const contentEditor = ref<HTMLTextAreaElement>();

const markdownShortcuts = [
  {
    label: "Bold",
    prefix: "**",
    suffix: "**",
    placeholder: "bolded",
  },
  {
    label: "Italics",
    prefix: "_",
    suffix: "_",
    placeholder: "italicised",
  },
  {
    label: "URL",
    prefix: "[",
    suffix: "](url)",
    placeholder: "https://example.com",
  },
  {
    label: "Code Block",
    prefix: "`",
    suffix: "`",
    placeholder: 'console.log("Hello World");',
  },
  {
    label: "List",
    prefix: "- ",
    suffix: "",
    placeholder: "a list item",
  },
  {
    label: "Heading 2",
    prefix: "## ",
    suffix: "",
    placeholder: "Heading 2",
  },
];

function handleContentKeydown(e: KeyboardEvent) {
  if (e.key === "Enter") {
    e.preventDefault();

    const textarea = contentEditor.value;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const text = textarea.value;
    const lineStart = text.lastIndexOf("\n", start - 1) + 1;
    const currentLine = text.slice(lineStart, start);

    // Check if the current line starts with a list marker
    const listMatch = currentLine.match(/^(\s*)([-*+]|\d+\.)\s/);
    let insertion = "\n";

    if (listMatch) {
      // If the line is empty except for the list marker, end the list
      if (currentLine.trim() === listMatch[0].trim()) {
        const removeLength = currentLine.length;
        model.value =
          text.slice(0, lineStart) + text.slice(lineStart + removeLength);

        // Move cursor to new position after removing the list marker
        nextTick(() => {
          textarea.selectionStart = textarea.selectionEnd = lineStart;
        });
        return;
      }
      // Otherwise, continue the list
      insertion = "\n" + listMatch[1] + listMatch[2] + " ";
    }

    model.value = text.slice(0, start) + insertion + text.slice(start);

    nextTick(() => {
      textarea.selectionStart = textarea.selectionEnd =
        start + insertion.length;
    });
  }
}

function applyMarkdown(shortcut: (typeof markdownShortcuts)[0]) {
  const textarea = contentEditor.value;
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;

  const selectedText = text.substring(start, end);
  const replacement = selectedText || shortcut.placeholder;

  const newText =
    text.substring(0, start) +
    shortcut.prefix +
    replacement +
    shortcut.suffix +
    text.substring(end);

  model.value = newText;

  nextTick(() => {
    textarea.focus();
    const newStart = start + shortcut.prefix.length;
    const newEnd = newStart + replacement.length;
    textarea.setSelectionRange(newStart, newEnd);
  });
}
</script>

<style scoped>
.prose {
  max-width: none;
}

.prose a {
  color: #60a5fa;
  text-decoration: none;
}

.prose a:hover {
  text-decoration: underline;
}

.prose img {
  border-radius: 0.5rem;
}

.prose code {
  background: #27272a;
  padding: 0.2em 0.4em;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

.prose pre {
  background: #18181b;
  padding: 1em;
  border-radius: 0.5rem;
}
</style>
