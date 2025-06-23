<template>
  <ul role="list" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <li
      class="col-span-1 divide-y divide-gray-200 dark:divide-zinc-600 rounded-lg bg-white dark:bg-zinc-800 shadow-sm"
    >
      <div class="flex w-full items-center justify-between space-x-6 p-6">
        <div class="flex-1 truncate">
          <div class="flex items-center space-x-3">
            <h3
              class="truncate text-sm font-medium text-gray-900 dark:text-zinc-100"
            >
              Objects
            </h3>
          </div>
          <p class="mt-1 text-wrap text-sm text-gray-500 dark:text-zinc-400">
            Objects are any files uploaded and used by Journal
          </p>
          <span class="mt-2 text-sm font-bold text-zinc-800 dark:text-zinc-200"
            >You have {{ objectsLength }} objects.</span
          >
        </div>
        <CubeIcon
          class="size-10 shrink-0 rounded-full text-zinc-900 dark:text-zinc-100"
        />
      </div>
      <div>
        <div class="-mt-px flex divide-x divide-gray-200 dark:divide-zinc-700">
          <div class="flex w-0 flex-1">
            <LoadingButton
              class="flex-1 items-center justify-center gap-x-3"
              :loading="cleanLoading"
              @click="() => clean()"
            >
              <TrashIcon class="size-5" aria-hidden="true" />
              Clean
            </LoadingButton>
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { CubeIcon, TrashIcon } from "@heroicons/vue/24/outline";

definePageMeta({
  layout: "admin",
});

useHead({
  title: "Manage",
});

const objectsLength = ref((await $journalFetch("/api/v1/admin/object")).length);

const cleanLoading = ref(false);

async function clean() {
  cleanLoading.value = true;
  try {
    const result = await $journalFetch<{ deleted: number }>(
      "/api/v1/admin/object",
      {
        method: "POST",
      }
    );
    objectsLength.value -= result.deleted as number;
  } catch (e) {
    createErrorNotification("Failed to clean objects", e);
  }
  cleanLoading.value = false;
}
</script>
