<template>
  <div v-if="category" class="px-4 sm:px-6 lg:px-8 space-y-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold text-gray-900">
          {{ category.name }}
        </h1>
        <p class="mt-2 text-sm text-gray-700">
          {{ category.description }}
        </p>
        <p class="mt-1 text-zinc-500 text-xs">
          Read: {{ category.readPermission }} / Write:
          {{ category.writePermission }}
        </p>
      </div>
      <div
        class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none inline-flex items-center gap-x-2"
      >
        <button
          class="inline-flex items-center gap-x-2 cursor-pointer block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          type="button"
          @click="() => (categoryEditorOpen = true)"
        >
          Edit <PencilIcon class="size-4" />
        </button>
        <LoadingButton
          :loading="deleteLoading"
          class="bg-red-600 hover:bg-red-500 inline-flex items-center gap-x-2"
          @click="() => deleteCategory()"
        >
          Delete <TrashIcon class="size-4" />
        </LoadingButton>
      </div>
    </div>
    <!-- category editor -->
    <CategoryEditor v-model="categoryEditorOpen" :existing="category" />
    <!-- topics -->
    <div class="px-4 sm:px-6 lg:px-8 py-8 border-1 border-gray-200 rounded-lg">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-base font-semibold text-gray-900">Topics</h1>
          <p class="mt-2 text-sm text-gray-700">
            Topics are organisation structures under categories. Each post must
            be under a topic.
          </p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            class="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            type="button"
            @click="() => (topicEditorOpen = true)"
          >
            Create
          </button>
        </div>
      </div>
      <div class="mt-8 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div
            class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"
          >
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
                      class="relative py-3.5 pr-4 pl-3 sm:pr-6 w-0"
                    >
                      <span class="sr-only">Edit & delete</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                  <tr v-for="topic in topics" :key="topic.id">
                    <td
                      class="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6"
                    >
                      {{ topic.name }}
                    </td>
                    <td
                      class="truncate px-3 py-4 text-sm whitespace-nowrap text-gray-500"
                    >
                      {{ topic.description }}
                    </td>
                    <td
                      class="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap inline-flex gap-x-2 sm:pr-6"
                    >
                      <button
                        class="cursor-pointer text-blue-600 hover:text-blue-900"
                        @click="() => (topicEditorOpen = topic)"
                      >
                        Edit<span class="sr-only">, {{ topic.name }}</span>
                      </button>

                      <LoadingButton
                        :style="'simple-red'"
                        :loading="deleteTopicLoading[topic.id] ?? false"
                        @click="() => deleteTopic(topic.id)"
                      >
                        Delete<span class="sr-only">, {{ topic.name }}</span>
                      </LoadingButton>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <!-- topic creator -->
      </div>
      <TopicEditor
        v-model="topicEditorOpen as boolean"
        :category-id="category.id"
        :existing="
          typeof topicEditorOpen === 'object' ? topicEditorOpen : undefined
        "
      />
    </div>
  </div>
  <NotAuthorized v-else />
</template>

<script setup lang="ts">
import { PencilIcon, TrashIcon } from "@heroicons/vue/24/outline";
import type { SerializeObject } from "nitropack";
import type { DeleteCategory } from "~~/server/api/v1/admin/category/index.delete";
import type { DeleteTopic } from "~~/server/api/v1/admin/topic/index.delete";
import type { Topic } from "~~/server/utils/drizzle";

definePageMeta({
  layout: "admin",
});

const categories = await useCategories();
const route = useRoute();
const router = useRouter();

const categoryId = route.params.id;
const categoryIndex = computed(() =>
  categories.value.findIndex((e) => e.id == categoryId)
);
const category = computed(() => categories.value[categoryIndex.value]);
if (!category.value)
  throw createError({
    statusCode: 404,
    statusMessage: "Category not found.",
    fatal: true,
  });

const topics = await useTopics(category.value.id);

const categoryEditorOpen = ref(false);
const topicEditorOpen = ref<true | false | SerializeObject<Topic>>(false);

// Delete category
const deleteLoading = ref(false);
async function deleteCategory() {
  deleteLoading.value = true;
  try {
    await $journalFetch("/api/v1/admin/category", {
      method: "DELETE",
      body: {
        id: category.value!.id,
      } satisfies typeof DeleteCategory.infer,
    });

    const categoryIndex = categories.value.findIndex(
      (e) => e.id == category.value!.id
    );
    if (categoryIndex != -1) categories.value.splice(categoryIndex, 1);

    router.push("/admin/category");
  } catch (e) {
    createErrorNotification("Failed to delete category", e);
  }
  deleteLoading.value = false;
}

// Delete topic
const deleteTopicLoading = ref<{ [key: string]: boolean }>({});
async function deleteTopic(id: string) {
  deleteTopicLoading.value[id] = true;
  try {
    await $journalFetch("/api/v1/admin/topic", {
      method: "DELETE",
      body: {
        id,
      } satisfies typeof DeleteTopic.infer,
    });

    const topicsInex = topics.value.findIndex((e) => e.id == id);
    if (topicsInex != -1) topics.value.splice(topicsInex, 1);
  } catch (e) {
    createErrorNotification("Failed to delete topic", e);
  }
  deleteTopicLoading.value[id] = false;
}

useHead({
  title: `"${category.value.name}" | Categories`,
});
</script>
