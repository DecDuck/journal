<template>
  <div>
    <h1 class="text-center text-xl font-bold"><slot /></h1>
    <form class="mt-4 grid grid-cols-1 bg-zinc-100 rounded-lg shadow-sm">
      <input
        v-model="delayedQuery"
        class="col-start-1 row-start-1 h-12 w-full pr-4 pl-11 text-base text-gray-900 outline-hidden placeholder:text-gray-400 sm:text-sm"
        placeholder="Search..."
      />
      <MagnifyingGlassIcon
        class="pointer-events-none col-start-1 row-start-1 ml-4 size-5 self-center text-gray-400"
        aria-hidden="true"
      />
    </form>
    <PaginatedContent
      v-slot="{ data }"
      endpoint="/api/v1/search"
      :opts="{ q: query, ...props.opts }"
    >
      <div
        v-if="!data?.results"
        class="min-h-[30rem] flex items-center justify-center"
      >
        <p class="text-sm text-zinc-400 animate-pulse">Loading...</p>
      </div>
      <div v-else-if="data.results.length > 0" class="py-3 space-y-2">
        <PostPreviewWidget
          v-for="{post, category, topic, user} in (data.results as any)"
          :key="post.id"
          :post="post"
          :category="category"
          :topic="topic"
          :user="user"
        />
      </div>
      <div v-else class="min-h-[30rem] flex items-center justify-center">
        <p class="text-sm text-zinc-400 animate-pulse">No results found.</p>
      </div>
    </PaginatedContent>
  </div>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon } from "@heroicons/vue/24/outline";

const props = defineProps<{ opts?: { [key: string]: string } }>();

let timeout: NodeJS.Timeout | undefined;

const route = useRoute();

const query = ref(route.query.q?.toString() ?? "");

const delayedQuery = computed({
  get() {
    return query.value;
  },
  set(v) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      query.value = v;
    }, 100);
  },
});
</script>
