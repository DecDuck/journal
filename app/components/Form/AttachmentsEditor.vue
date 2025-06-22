<template>
  <div class="space-y-4">
    <div class="flex flex-row gap-x-3 items-center">
      <button
        tabindex="0"
        class="bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-gray-900 dark:text-zinc-100 cursor-pointer inline-flex min-h-9 items-center justify-center rounded-md gap-x-2 px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
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
        class="inline-flex items-center gap-x-1 text-red-600 dark:text-red-500 text-sm"
      >
        <ExclamationCircleIcon class="size-6" />
        Files too large. Must be &lt;{{ formatBytes(maxTotal) }} combined.
        (currently {{ formatBytes(totalFilesize!) }})
      </p>
    </div>
    <div class="flex flex-wrap gap-4">
      <FileWidget
        v-for="(file, fileIndex) in filelistNames"
        :key="file.filename"
        :file="file"
        :max-individual="maxIndividual"
        :remove="() => removeFile(fileIndex)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowUpTrayIcon,
  ExclamationCircleIcon,
} from "@heroicons/vue/24/outline";

const model = defineModel<Array<File> | undefined>();

const input = ref<HTMLInputElement>();

const props = defineProps<{
  configuration?: { maxIndividual?: number; maxTotal?: number };
}>();

const maxIndividual = props.configuration?.maxIndividual ?? 2 * 1024 * 1024; // Default of 2MB
const maxTotal = props.configuration?.maxTotal ?? 10 * 1024 * 1024; // Default of 10MB

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
