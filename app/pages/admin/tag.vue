<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold text-gray-900">Tags</h1>
        <p class="mt-2 text-sm text-gray-700">
          Tags can be added by users to posts to add another level of
          organisation to their posts.
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          class="cursor-pointer block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          type="button"
          @click="() => (tagEditorOpen = true)"
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
                  <th scope="col" class="relative py-3.5 pr-4 pl-3 sm:pr-6 w-0">
                    <span class="sr-only">Edit & delete</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="tag in tags" :key="tag.id">
                  <td
                    class="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6"
                  >
                    {{ tag.name }}
                  </td>
                  <td
                    class="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap inline-flex gap-x-2 sm:pr-6"
                  >
                    <button
                      class="cursor-pointer text-blue-600 hover:text-blue-900"
                      @click="() => (tagEditorOpen = tag)"
                    >
                      Edit<span class="sr-only">, {{ tag.name }}</span>
                    </button>

                    <LoadingButton
                      :style="'simple-red'"
                      :loading="deleteLoading[tag.id] ?? false"
                      @click="() => deleteCategory(tag.id)"
                    >
                      Delete<span class="sr-only">, {{ tag.name }}</span>
                    </LoadingButton>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <TagEditor
      v-model="(tagEditorOpen as boolean)"
      :existing="typeof tagEditorOpen === 'object' ? tagEditorOpen : undefined"
    />
  </div>
</template>

<script setup lang="ts">
import type { SerializeObject } from "nitropack";
import type { DeleteCategory } from "~~/server/api/v1/admin/category/index.delete";
import type { Tag } from "~~/server/utils/drizzle";

definePageMeta({
  layout: "admin",
});

useHead({
  title: "Tags",
});

const tags = await useTags();

const tagEditorOpen = ref<true | false | SerializeObject<Tag>>(false);

const deleteLoading: Ref<{ [key: string]: boolean | undefined }> = ref({});

async function deleteCategory(id: string) {
  deleteLoading.value[id] = true;
  try {
    await $journalFetch("/api/v1/admin/tag", {
      method: "DELETE",
      body: {
        id,
      } satisfies typeof DeleteCategory.infer,
    });

    const tagIndex = tags.value.findIndex((e) => e.id == id);
    if (tagIndex != -1) tags.value.splice(tagIndex, 1);
  } catch (e) {
    createErrorNotification("Failed to delete tag", e);
  }
  deleteLoading.value[id] = false;
}
</script>
