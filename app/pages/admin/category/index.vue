<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold text-gray-900">Categories</h1>
        <p class="mt-2 text-sm text-gray-700">
          Categories are the main organisation unit in Journal. Each category
          contains a series of "topics", which under users can make posts.
          Categories can also be tied to GitHub repositories, and can be marked
          as public, read-only, or private.
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          class="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          type="button"
          @click="() => (createCategoryOpen = true)"
        >
          Create
        </button>
      </div>
    </div>
    <div class="mt-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div
            class="overflow-hidden shadow-sm ring-1 ring-black/5 sm:rounded-lg"
          >
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Read
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Post
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Repository
                  </th>
                  <th scope="col" class="relative py-3.5 pr-4 pl-3 sm:pr-6 w-0">
                    <span class="sr-only">Edit & delete</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="category in categories" :key="category.id">
                  <td
                    class="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6"
                  >
                    {{ category.name }}
                  </td>
                  <td
                    class="truncate px-3 py-4 text-sm whitespace-nowrap text-gray-500"
                  >
                    {{ category.description }}
                  </td>
                  <td class="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                    {{ category.readPermission }}
                  </td>
                  <td class="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                    {{ category.writePermission }}
                  </td>
                  <td class="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                    {{ category.repository ?? "N/A" }}
                  </td>
                  <td
                    class="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap inline-flex gap-x-2 sm:pr-6"
                  >
                    <NuxtLink
                      :href="`/admin/category/${category.id}`"
                      class="cursor-pointer text-blue-600 hover:text-blue-900"
                    >
                      Edit<span class="sr-only">, {{ category.name }}</span>
                    </NuxtLink>
                    <LoadingButton
                      :style="'simple-red'"
                      :loading="deleteLoading[category.id] ?? false"
                      @click="() => deleteCategory(category.id)"
                    >
                      Delete<span class="sr-only">, {{ category.name }}</span>
                    </LoadingButton>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <CategoryEditor v-model="createCategoryOpen" />
  </div>
</template>

<script setup lang="ts">
import type { DeleteCategory } from "~~/server/api/v1/admin/category/index.delete";

definePageMeta({
  layout: "admin",
});

useHead({
  title: "Categories",
});

const categories = await useCategories();

const createCategoryOpen = ref(false);

const deleteLoading: Ref<{ [key: string]: boolean | undefined }> = ref({});

async function deleteCategory(id: string) {
  deleteLoading.value[id] = true;
  try {
    await $journalFetch("/api/v1/admin/category", {
      method: "DELETE",
      body: {
        id,
      } satisfies typeof DeleteCategory.infer,
    });

    const categoryIndex = categories.value.findIndex((e) => e.id == id);
    if (categoryIndex != -1) categories.value.splice(categoryIndex, 1);
  } catch (e) {
    createErrorNotification("Failed to delete category", e);
  }
  deleteLoading.value[id] = false;
}
</script>
