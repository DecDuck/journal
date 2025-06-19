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
        <div v-if="!data?.results" class="min-h-[30rem] flex items-center justify-center">
          <p class="text-sm text-zinc-400 animate-pulse">Loading...</p>
        </div>
        <div v-else class="py-3 space-y-2">
          <PostPreviewWidget
            v-for="{post, category, topic} in (data.results as Array<{post: SerializeObject<Post>, category: SerializeObject<Category>, topic: SerializeObject<Topic>}>)"
            :key="post.id"
            :post="post"
            :category="category"
            :topic="topic"
          />
        </div>
      </PaginatedContent>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SerializeObject } from "nitropack";
import type { Category, Post, Topic } from "~~/server/utils/drizzle";

const route = useRoute();
const userId = route.params.id;

const user = await $journalFetch("/api/v1/user", {
  query: { id: userId },
});

useHead({
  title: user.displayName,
});
</script>
