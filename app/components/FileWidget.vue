<template>
  <component
    :is="props.downloadUrl ? NuxtLink : 'div'"
    :class="[
      'pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white dark:bg-zinc-900 shadow',
      toolarge
        ? 'ring-1 ring-red-600 dark:ring-red-500'
        : 'ring-1 ring-black/5 dark:ring-white/5',
      props.downloadUrl ? 'hover:bg-zinc-50 dark:hover:bg-zinc-800' : '',
    ]"
    :href="props.downloadUrl"
    target="_blank"
  >
    <div class="p-2">
      <div class="flex items-start">
        <div class="shrink-0">
          <component
            :is="
              mimeTypeIcons[file.type.split('/').at(0) ?? ''] ?? PaperClipIcon
            "
            class="size-6 text-zinc-400 dark:text-zinc-600"
            aria-hidden="true"
          />
        </div>
        <div class="ml-3 w-0 flex-1 pt-0.5">
          <p
            class="truncate text-sm font-medium text-gray-900 dark:text-zinc-100"
          >
            {{ file.filename }}
            <span class="text-zinc-400 dark:text-zinc-600">{{
              formatBytes(file.size)
            }}</span>
          </p>
          <p
            v-if="toolarge"
            class="mt-1 inline-flex items-center gap-x-1 text-red-600 dark:text-red-500 text-[10px]"
          >
            <ExclamationCircleIcon class="size-4" />
            File too large. Must be &lt;{{
              formatBytes(props.maxIndividual ?? 0)
            }}
          </p>
        </div>
        <div v-if="props.remove" class="ml-4 flex shrink-0">
          <button
            type="button"
            class="cursor-pointer inline-flex rounded-md bg-white dark:bg-zinc-900 text-gray-400 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-hidden"
            @click="() => props.remove!()"
          >
            <span class="sr-only">Close</span>
            <XMarkIcon class="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
import { NuxtLink } from "#components";
import {
  DocumentIcon,
  ExclamationCircleIcon,
  MusicalNoteIcon,
  PaperClipIcon,
  PhotoIcon,
  VideoCameraIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import type { FileAttachment } from "~/composables/data";

const mimeTypeIcons: { [key: string]: Component } = {
  image: PhotoIcon,
  audio: MusicalNoteIcon,
  video: VideoCameraIcon,
  text: DocumentIcon,
};

const props = defineProps<{
  file: FileAttachment;
  maxIndividual?: number;
  downloadUrl?: string;
  remove?: () => void;
}>();

const toolarge = computed(
  () => props.maxIndividual && props.file.size > props.maxIndividual
);
</script>
