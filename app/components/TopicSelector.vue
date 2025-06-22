<template>
  <Combobox v-model="model" as="div" @update:model-value="query = ''">
    <ComboboxLabel
      class="block text-sm/6 font-medium text-gray-900 dark:text-zinc-100"
      >Topic</ComboboxLabel
    >
    <div class="relative mt-2">
      <ComboboxInput
        class="block w-full rounded-md bg-white dark:bg-zinc-900 py-1.5 pr-12 pl-3 text-base text-gray-900 dark:text-zinc-100 outline-1 -outline-offset-1 outline-gray-300 dark:outline-zinc-700 placeholder:text-gray-400 dark:placeholder:text-zinc-600 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
        :display-value="() => model?.name ?? ''"
        placeholder="Topic"
        @change="query = $event.target.value"
        @blur="query = ''"
      >
        {{ model }}
      </ComboboxInput>
      <ComboboxButton
        class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-hidden"
      >
        <ChevronUpDownIcon
          v-if="topics"
          class="size-5 text-gray-400"
          aria-hidden="true"
        />
        <svg
          v-else
          aria-hidden="true"
          class="size-5 animate-spin text-transparent fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      </ComboboxButton>

      <ComboboxOptions
        v-if="filteredTopics.length > 0"
        class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-zinc-900 py-1 text-base shadow-lg ring-1 ring-black/5 dark:ring-white/5 focus:outline-hidden sm:text-sm"
      >
        <ComboboxOption
          v-for="topic in filteredTopics"
          :key="topic.id"
          v-slot="{ active, selected }"
          :value="topic"
          as="template"
        >
          <li
            :class="[
              'relative cursor-default py-2 pr-9 pl-3 select-none',
              active
                ? 'bg-blue-600 text-white outline-hidden'
                : 'text-gray-900 dark:text-zinc-100',
            ]"
          >
            <span :class="['block truncate', selected && 'font-semibold']">
              {{ topic.name }}
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
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxLabel,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/vue";
import type { SerializeObject } from "nitropack";
import type { Topic } from "~~/server/utils/drizzle";
const props = defineProps<{ categoryId: string }>();

const model = defineModel<SerializeObject<Topic> | undefined>();
const categoryId = computed(() => props.categoryId);

const topics = ref<Array<SerializeObject<Topic>> | undefined>();
async function updateTopics(catId: string) {
  model.value = undefined;
  topics.value = undefined;
  topics.value = (await useTopics(catId)).value;
}
await updateTopics(props.categoryId);

watch(categoryId, async (v) => {
  await updateTopics(v);
});
const query = ref("");
const filteredTopics = computed(
  () =>
    topics.value?.filter((e) =>
      e.name.toLowerCase().includes(query.value.toLowerCase())
    ) ?? []
);
</script>
