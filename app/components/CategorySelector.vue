<template>
  <Combobox v-model="model" as="div" @update:model-value="query = ''">
    <ComboboxLabel class="block text-sm/6 font-medium text-gray-900"
      >Category</ComboboxLabel
    >
    <div class="relative mt-2">
      <ComboboxInput
        class="block w-full rounded-md bg-white py-1.5 pr-12 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
        :display-value="(value) => (value as SerializeObject<Category>)?.name"
        placeholder="Category"
        @change="query = $event.target.value"
        @blur="query = ''"
      />
      <ComboboxButton
        class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-hidden"
      >
        <ChevronUpDownIcon class="size-5 text-gray-400" aria-hidden="true" />
      </ComboboxButton>

      <ComboboxOptions
        v-if="filteredCategories.length > 0"
        class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden sm:text-sm"
      >
        <ComboboxOption
          v-for="category in filteredCategories"
          :key="category.id"
          v-slot="{ active, selected }"
          :value="category"
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
              {{ category.name }}
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
import type { Category } from "~~/server/utils/drizzle";
const model = defineModel<SerializeObject<Category> | undefined>();

const user = useUser();

const categories = await useCategories();
const query = ref("");
const filteredCategories = computed(() =>
  categories.value.filter(
    (e) =>
      e.name.toLowerCase().includes(query.value.toLowerCase()) &&
      e.writePermission <= (user.value?.permissionLevel ?? -1)
  )
);
</script>
