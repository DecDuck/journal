<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold text-gray-900">Users</h1>
        <p class="mt-2 text-sm text-gray-700">
          They use.
        </p>
      </div>
    </div>
    <div class="flow-root">
      <PaginatedContent
        v-slot="{ data }"
        endpoint="/api/v1/admin/users"
        :count="20"
      >
        <div
          v-if="!data?.results"
          class="min-h-[30rem] flex items-center justify-center"
        >
          <p class="text-sm text-zinc-400 animate-pulse">Loading...</p>
        </div>
        <div v-else-if="data.results.length > 0" class="mt-8 flow-root">
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
                      <th scope="col" class="relative w-9">
                        <span class="sr-only">Avatar</span>
                      </th>
                      <th
                        scope="col"
                        class="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Display Name
                      </th>
                      <th
                        scope="col"
                        class="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Username
                      </th>
                      <th
                        scope="col"
                        class="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        class="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Permission
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
                    <tr
                      v-for="user in (data.results as Array<SerializeObject<User>>)"
                      :key="user.id"
                    >
                      <td
                        class="inline-flex pl-3 items-center justify-center relative text-right text-sm font-medium whitespace-nowrap inline-flex gap-x-2"
                      >
                        <img
                          :src="useObject(user.avatar)"
                          class="size-6 rounded-full"
                        />
                      </td>
                      <td
                        class="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6"
                      >
                        {{ user.displayName }}
                      </td>
                      <td
                        class="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6"
                      >
                        {{ user.username }}
                      </td>
                      <td
                        class="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6"
                      >
                        {{ user.email }}
                      </td>
                      <td
                        class="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6"
                      >
                        {{ user.permissionLevel }}
                      </td>
                      <td
                        class="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap inline-flex gap-x-2 sm:pr-6"
                      >
                        <button
                          class="cursor-pointer text-blue-600 hover:text-blue-900"
                        >
                          Edit<span class="sr-only">, {{ user.username }}</span>
                        </button>

                        <LoadingButton :style="'simple-red'" :loading="false">
                          Delete<span class="sr-only"
                            >, {{ user.username }}</span
                          >
                        </LoadingButton>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="min-h-[30rem] flex items-center justify-center">
          <p class="text-sm text-zinc-400 animate-pulse">No results found.</p>
        </div>
      </PaginatedContent>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SerializeObject } from "nitropack";
import PaginatedContent from "~/components/PaginatedContent.vue";
import type { User } from "~~/server/utils/drizzle";

definePageMeta({
  layout: "admin",
});
</script>
