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

    <div class="mt-16 grid lg:grid-cols-2 gap-8">
      <div>
        <h2 class="text-sm font-medium text-gray-500">Recent posts</h2>
        <div class="mt-4 space-y-2 grid grid-cols-1">
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
      <div>
        <h2 class="text-sm font-medium text-gray-500">Categories</h2>
        <ul
          role="list"
          class="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6"
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
              class="flex flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b border-gray-200 bg-white"
            >
              <div class="flex-1 truncate px-4 py-2 text-sm">
                <NuxtLink
                  :href="`/category/${category.id}`"
                  class="font-medium text-gray-900 hover:text-gray-600"
                  >{{ category.name }}</NuxtLink
                >
                <p class="text-gray-500">{{ category.name }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon } from "@heroicons/vue/24/outline";

const posts = await $journalFetch("/api/v1/discover/post");
const runtimeConfig = useRuntimeConfig();

const router = useRouter();

const query = ref("");
function search() {
  router.push({ query: { q: query.value }, path: "/search" });
}

const categories = await useCategories();

useHead({
  title: "Home",
});
</script>
