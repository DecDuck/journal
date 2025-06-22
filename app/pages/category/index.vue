<template>
  <div>
    <h1 class="text-center text-4xl font-bold text-gray-900 dark:text-zinc-100">Categories</h1>
    <div class="mt-8">
      <ul
        role="list"
        class="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6"
      >
        <li
          v-for="category in categories"
          :key="category.id"
          class="col-span-1 flex rounded-md shadow-xs"
        >
          <div
            :class="[
              'bg-blue-600',
              'flex w-16 shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white',
            ]"
          >
            {{ category.name[0]!.toUpperCase() }}
          </div>
          <div
            class="flex flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
          >
            <div class="flex-1 truncate px-4 py-2 text-sm">
              <NuxtLink
                :href="`/category/${category.id}`"
                class="font-medium text-gray-900 hover:text-gray-600 dark:text-zinc-100 dark:hover:text-zinc-400"
                >{{ category.name }}</NuxtLink
              >
              <p class="text-gray-500 dark:text-zinc-400">{{ category.name }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const categories = await useCategories();

useHead({
  title: "Categories",
});
</script>
