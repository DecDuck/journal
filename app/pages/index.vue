<script setup lang="ts">
import { MagnifyingGlassIcon } from "@heroicons/vue/24/outline";

const posts = await $journalFetch("/api/v1/discover/post");
const runtimeConfig = useRuntimeConfig();

const router = useRouter();

const query = ref("");
function search() {
  router.push({ query: { q: query.value }, path: "/search" });
}
</script>

<template>
  <div>
    <div class="max-w-xl mx-auto">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <AppIcon class="mx-auto h-10 w-auto" />
        <h2
          class="mt-5 text-center text-2xl/9 font-bold tracking-tight text-gray-900"
        >
          Welcome to {{ runtimeConfig.public.whitelabel.title }}
        </h2>
      </div>
      <form
        class="mt-4 grid grid-cols-1 bg-zinc-100 rounded-lg shadow-sm"
        @submit.prevent="() => search()"
      >
        <input
          v-model="query"
          class="col-start-1 row-start-1 h-12 w-full pr-4 pl-11 text-base text-gray-900 outline-hidden placeholder:text-gray-400 sm:text-sm"
          placeholder="Search..."
          name="q"
        />
        <MagnifyingGlassIcon
          class="pointer-events-none col-start-1 row-start-1 ml-4 size-5 self-center text-gray-400"
          aria-hidden="true"
        />
        <button type="submit" class="hidden" />
      </form>
    </div>

    <div class="mt-16 grid lg:grid-cols-2 gap-3">
      <div class="">
        <div class="flex flex-col items-center">
          <h1 class="text-xl font-zinc-900 font-bold">New Posts</h1>
          <NuxtLink class="text-sm text-blue-600" href="/post"
            >View all &rarr;</NuxtLink
          >
        </div>
        <div class="mt-4 space-y-2">
          <PostPreviewWidget
            v-for="{ post, category, topic, user } in posts"
            :key="post.id"
            :post="post"
            :category="category!"
            :topic="topic!"
            :user="user!"
          />
        </div>
      </div>
    </div>
  </div>
</template>
