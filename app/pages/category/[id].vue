<template>
  <div>
    <h1 class="text-center text-zinc-900 dark:text-zinc-100 text-4xl font-bold">Topics</h1>
    <div class="mt-8">
      <ul
        role="list"
        class="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6"
      >
        <li
          v-for="topic in topics"
          :key="topic.id"
          class="col-span-1 flex rounded-md shadow-xs"
        >
          <div
            :class="[
              'bg-blue-600',
              'flex w-16 shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white',
            ]"
          >
            {{ topic.name[0]!.toUpperCase() }}
          </div>
          <div
            class="flex flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b border-gray-200 bg-white dark:bg-zinc-800 dark:border-zinc-700"
          >
            <div class="flex-1 truncate px-4 py-2 text-sm">
              <NuxtLink
                :href="`/topic/${topic.id}`"
                class="font-medium text-gray-900 dark:text-zinc-100 hover:text-gray-600 dark:hover:text-zinc-400"
                >{{ topic.name }}</NuxtLink
              >
              <p class="text-gray-500 dark:text-zinc-400">{{ topic.name }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

const topics = await useTopics(route.params.id!.toString());

useHead({
  title: "Categories",
});
</script>
