<!-- eslint-disable vue/no-v-html -->
<!-- stolen from me lol -->
<template>
  <div class="mt-1 flex flex-col gap-4">
    <SwitchGroup as="div" class="flex items-center">
      <Switch
        v-model="viewing"
        :class="[
          viewing ? 'bg-blue-600' : 'bg-gray-200',
          'relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:outline-hidden',
        ]"
      >
        <span
          aria-hidden="true"
          :class="[
            viewing ? 'translate-x-3' : 'translate-x-0',
            'pointer-events-none inline-block size-3 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out',
          ]"
        />
      </Switch>
      <SwitchLabel as="span" class="ml-3 text-sm font-medium text-gray-900">
        {{ viewing ? "Preview" : "Edit" }}
      </SwitchLabel>
    </SwitchGroup>
    <div class="h-[100px]">
      <!-- Editor -->
      <div v-if="!viewing" class="flex flex-col h-full">
        <textarea
          id="content"
          ref="contentEditor"
          v-model="model"
          placeholder="Edit..."
          class="flex-1 px-2 py-1 rounded-md bg-zinc-50 border border-zinc-300 text-zinc-900 focus:border-blue-500 focus:ring-blue-500 font-mono resize-none"
          required
          @keydown="handleContentKeydown"
        />
      </div>

      <!-- Preview -->
      <div v-else class="flex flex-col h-full">
        <div
          class="flex-1 px-2 py-1 rounded-md bg-white border border-zinc-300 overflow-y-auto"
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
import { Switch, SwitchGroup, SwitchLabel } from "@headlessui/vue";
import { micromark } from "micromark";

const model = defineModel<string>();

const markdownPreview = computed(() => {
  // TODO: maybe?? add https://github.com/cure53/DOMPurify
  // micromark says its safe, but this is straight html we are injecting
  return micromark(model.value ?? "");
});

const contentEditor = ref<HTMLTextAreaElement>();
const viewing = ref(false);

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
