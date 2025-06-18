<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <div>
      <img
        class="h-32 w-full object-cover lg:h-48 rounded-t-lg"
        src="@/assets/backdrops/uhoh.jpg"
        alt=""
      />
    </div>
    <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div class="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
        <div class="flex">
          <img
            class="size-24 rounded-full ring-4 ring-zinc-50 sm:size-32 bg-white p-2"
            :src="useObject(user.avatar)"
            alt=""
          />
        </div>
        <div
          class="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1"
        >
          <div class="mt-6 min-w-0 flex-1 sm:hidden md:block">
            <h1 class="truncate text-2xl font-bold text-gray-900">
              {{ user.displayName }}
            </h1>
            <p class="text-sm text-zinc-400">@{{ user.username }}</p>
          </div>
        </div>
      </div>
      <div class="mt-6 hidden min-w-0 flex-1 sm:block md:hidden">
        <h1 class="truncate text-2xl font-bold text-gray-900">
          {{ user.displayName }}
        </h1>
        <p class="text-sm text-zinc-400">@{{ user.username }}</p>
      </div>
    </div>

    <div class="px-4 py-3">
      <h1 class="text-xl font-semibold">Posts</h1>
      <PaginatedContent
        v-slot="{ data }"
        endpoint="/api/v1/user/posts"
        :opts="{ id: user.id }"
      >
        <div v-if="!data">
          {{ data }}
        </div>
        <div v-else class="py-3 space-y-2">
          <article
            v-for="{post, category, topic} in (data.results as Array<{post: SerializeObject<Post>, category: SerializeObject<Category>, topic: SerializeObject<Topic>}>)"
            :key="post.id"
            class="relative group cursor-pointer shadow-sm px-4 py-3 rounded"
          >
            <div class="flex flex-wrap items-center gap-x-3">
              <h1
                class="text-lg font-semibold text-zinc-900 group-hover:text-zinc-500"
              >
                {{ post.title }}
              </h1>
              <p class="text-sm text-zinc-400">
                {{ relativeTime(post.createdAt) }}
              </p>
            </div>
            <div class="py-1">
              <nav class="flex" aria-label="Breadcrumb">
                <ol role="list" class="flex items-center space-x-1">
                  <li>
                    <div class="text-gray-400 hover:text-gray-500">
                      <HomeIcon class="size-4 shrink-0" aria-hidden="true" />
                      <span class="sr-only">Home</span>
                    </div>
                  </li>
                  <li>
                    <div class="flex items-center">
                      <ChevronRightIcon
                        class="size-4 shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <div class="ml-1 text-sm font-medium text-gray-500">
                        {{ category.name }}
                      </div>
                    </div>
                  </li>
                  <li>
                    <div class="flex items-center">
                      <ChevronRightIcon
                        class="size-4 shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <div class="ml-1 text-sm font-medium text-gray-500">
                        {{ topic.name }}
                      </div>
                    </div>
                  </li>
                </ol>
              </nav>
            </div>
            <div class="overflow-hidden relative max-h-[11rem]">
              <div
                class="prose prose-sm prose-blue"
                v-html="micromark(post.content)"
              />
              <div
                class="absolute inset-0 bg-linear-to-b from-transparent to-white"
              />
            </div>
            <NuxtLink class="absolute inset-0" :href="`/post/${post.id}`" />
          </article>
        </div>
      </PaginatedContent>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SerializeObject } from "nitropack";
import type { Category, Post, Topic } from "~~/server/utils/drizzle";
import { micromark } from "micromark";
import { ChevronRightIcon, HomeIcon } from "@heroicons/vue/24/outline";

const route = useRoute();
const userId = route.params.id;

const user = await $journalFetch("/api/v1/user", {
  query: { id: userId },
});

useHead({
  title: user.displayName,
});
</script>
