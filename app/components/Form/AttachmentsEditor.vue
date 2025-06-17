<template>
  <div class="space-y-4">
    <div class="flex flex-row gap-x-3 items-center">
      <button
        tabindex="0"
        class="bg-zinc-100 hover:bg-zinc-200 cursor-pointer inline-flex min-h-9 items-center justify-center rounded-md gap-x-2 px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        @click.prevent="() => input?.click()"
      >
        <ArrowUpTrayIcon class="size-4" />
        Upload
      </button>
      <input
        id="file-upload"
        ref="input"
        class="hidden"
        type="file"
        multiple
        @change="(e) => processFilelist((e.target as any)?.files)"
      />
      <p
        v-if="toolarge"
        class="inline-flex items-center gap-x-1 text-red-600 text-sm"
      >
        <ExclamationCircleIcon class="size-6" />
        Files too large. Must be &lt;{{ formatBytes(maxTotal) }} combined.
        (currently {{ formatBytes(totalFilesize!) }})
      </p>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="(file, fileIndex) in filelistNames"
        :key="file.filename"
        :class="[
          'pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow ',
          file.toolarge ? 'ring-1 ring-red-600' : 'ring-1 ring-black/5',
        ]"
      >
        <div class="p-4">
          <div class="flex items-start">
            <div class="shrink-0">
              <component
                :is="
                  mimeTypeIcons[file.type.split('/').at(0) ?? ''] ??
                  PaperClipIcon
                "
                class="size-6 text-zinc-400"
                aria-hidden="true"
              />
            </div>
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p class="truncate text-sm font-medium text-gray-900">
                {{ file.filename }}
              </p>
              <p class="mt-1 text-sm text-gray-500">
                {{ formatBytes(file.size) }}
              </p>
              <p
                v-if="file.toolarge"
                class="mt-1 inline-flex items-center gap-x-1 text-red-600 text-[10px]"
              >
                <ExclamationCircleIcon class="size-4" />
                File too large. Must be &lt;{{ formatBytes(maxIndividual) }}
              </p>
            </div>
            <div class="ml-4 flex shrink-0">
              <button
                type="button"
                class="cursor-pointer inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-hidden"
                @click="() => removeFile(fileIndex)"
              >
                <span class="sr-only">Close</span>
                <XMarkIcon class="size-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowUpTrayIcon,
  DocumentIcon,
  ExclamationCircleIcon,
  MusicalNoteIcon,
  PaperClipIcon,
  PhotoIcon,
  VideoCameraIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";

const model = defineModel<Array<File> | undefined>();

const input = ref<HTMLInputElement>();

const props = defineProps<{
  configuration?: { maxIndividual?: number; maxTotal?: number };
}>();

const maxIndividual = props.configuration?.maxIndividual ?? 2 * 1024 * 1024; // Default of 2MB
const maxTotal = props.configuration?.maxTotal ?? 10 * 1024 * 1024; // Default of 10MB

const mimeTypeIcons: { [key: string]: Component } = {
  image: PhotoIcon,
  audio: MusicalNoteIcon,
  video: VideoCameraIcon,
  text: DocumentIcon,
};

const filelistNames = computed(() =>
  model.value?.map((file) => ({
    filename: file.name,
    size: file.size,
    type: file.type,
    toolarge: file.size >= maxIndividual, // 2 MB
  }))
);

const totalFilesize = computed(() =>
  filelistNames.value?.reduce((a, b) => a + b.size, 0)
);

const toolarge = computed(() => (totalFilesize.value ?? 0) > maxTotal); // 10MB

function processFilelist(files: FileList) {
  const result = [];
  for (const file of files) {
    result.push(file);
  }
  model.value = [...(model.value ?? []), ...result];
}

function removeFile(index: number) {
  model.value?.splice(index, 1);
}
</script>
