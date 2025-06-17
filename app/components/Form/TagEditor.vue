<template>
  <div class="space-y-2">
    <Combobox v-model="currentTag" as="div" @update:model-value="query = ''">
      <div class="relative">
        <ComboboxInput
          class="block w-full rounded-md bg-white py-1.5 pr-12 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
          :display-value="(value: unknown) => currentTag?.name ?? ''"
          placeholder="Search..."
          @change="query = $event.target.value"
          @blur="query = ''"
          @keydown.prevent.enter="() => appendTag()"
        />
        <ComboboxButton
          class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-hidden"
        >
          <ChevronUpDownIcon class="size-5 text-gray-400" aria-hidden="true" />
        </ComboboxButton>

        <ComboboxOptions
          v-if="filteredTags.length > 0"
          class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden sm:text-sm"
        >
          <ComboboxOption
            v-for="tag in filteredTags"
            :key="tag.id"
            v-slot="{ active, selected }"
            :value="tag"
            as="template"
          >
            <li
              :class="[
                'relative cursor-default py-2 pr-9 pl-3 select-none',
                active
                  ? 'bg-blue-600 text-white outline-hidden'
                  : 'text-gray-900',
              ]"
            >
              <span :class="['block truncate', selected && 'font-semibold']">
                {{ tag.name }}
              </span>

              <span
                v-if="selected"
                :class="[
                  'absolute inset-y-0 right-0 flex items-center pr-4',
                  active ? 'text-white' : 'text-blue-600',
                ]"
              >
                <CheckIcon class="size-5" aria-hidden="true" />
              </span>
            </li>
          </ComboboxOption>
        </ComboboxOptions>
      </div>
    </Combobox>
    <div class="flex flex-row gap-x-1">
      <span
        v-for="tag in modelTags"
        :key="tag.id"
        class="inline-flex items-center gap-x-0.5 rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700"
      >
        {{ tag.name }}
        <button
          type="button"
          class="cursor-pointer group relative -mr-1 size-3.5 rounded-full hover:bg-blue-600/20"
          @click="() => removeTag(tag.id)"
        >
          <span class="sr-only">Remove</span>
          <svg
            viewBox="0 0 14 14"
            class="size-3.5 stroke-blue-800/50 group-hover:stroke-blue-800/75"
          >
            <path d="M4 4l6 6m0-6l-6 6" />
          </svg>
          <span class="absolute -inset-1" />
        </button>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/vue";

import type { SerializeObject } from "nitropack";
import type { Tag } from "~~/server/utils/drizzle";

const model = defineModel<string[]>();
model.value ??= [];

const tags = await useTags();

const modelTags = computed(() =>
  model.value?.map((e) => tags.value.find((v) => e == v.id)!)
);

const currentTag = ref<SerializeObject<Tag> | undefined>();

const query = ref("");
const filteredTags = computed(() =>
  tags.value.filter(
    (e) =>
      e.name.toLowerCase().includes(query.value.toLowerCase()) &&
      !(model.value ?? []).includes(e.id)
  )
);

function appendTag() {
  if (!currentTag.value) return;
  model.value ??= [];
  model.value.push(currentTag.value.id);
  currentTag.value = undefined;
}

function removeTag(id: string) {
  if (!model.value) return;
  const index = model.value.findIndex((e) => e == id);
  model.value.splice(index, 1);
}
</script>
