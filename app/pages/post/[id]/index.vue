<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="space-y-6">
    <nav class="flex" aria-label="Breadcrumb">
      <ol role="list" class="flex items-center space-x-4">
        <li>
          <div>
            <NuxtLink href="/" class="text-gray-400 hover:text-gray-500">
              <HomeIcon class="size-5 shrink-0" aria-hidden="true" />
              <span class="sr-only">Home</span>
            </NuxtLink>
          </div>
        </li>
        <li v-for="page in pages" :key="page.name">
          <div class="flex items-center">
            <ChevronRightIcon
              class="size-5 shrink-0 text-gray-400"
              aria-hidden="true"
            />
            <NuxtLink
              :href="page.href"
              class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
              >{{ page.name }}</NuxtLink
            >
          </div>
        </li>
      </ol>
    </nav>

    <article
      class="bg-white shadow-sm px-4 py-3 lg:px-10 lg:py-8 rounded-lg w-full flex flex-col items-start justify-between"
    >
      <div class="flex items-center gap-x-4 text-xs">
        <time :datetime="post.createdAt" class="text-gray-500">{{
          post.createdAt
        }}</time>
        <NuxtLink
          v-for="tag in postTags"
          :key="tag.id"
          :href="`/tag/${tag.id}`"
          class="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
          >{{ tag.name }}</NuxtLink
        >
      </div>
      <div class="mt-2 group relative">
        <div class="relative flex items-center gap-x-4">
          <img
            :src="useObject(author.avatar)"
            alt=""
            class="size-10 rounded-full bg-gray-50"
          />
          <div class="text-sm/6">
            <p class="font-semibold text-gray-900">
              <NuxtLink :href="`/user/${author.id}`">
                <span class="absolute inset-0" />
                {{ author.displayName }}
              </NuxtLink>
            </p>
            <p class="text-gray-600">@{{ author.username }}</p>
          </div>
        </div>

        <h3 class="mt-5 text-2xl font-semibold text-gray-900">
          {{ post.title }}
        </h3>

        <div class="mt-3 prose prose-blue" v-html="content" />
      </div>
    </article>

    <div>
      {{ replies }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronRightIcon, HomeIcon } from "@heroicons/vue/24/outline";
import type { SerializeObject } from "nitropack";
import type { Post, Reply, User } from "~~/server/utils/drizzle";
import { micromark } from "micromark";

const route = useRoute();
const { post, replies, author } = await $journalFetch<
  SerializeObject<{ post: Post; replies: Array<Reply>; author: User }>
>("/api/v1/post", {
  query: { id: route.params.id },
});

const categories = await useCategories();
const category = categories.value.find((e) => e.id === post.categoryId)!;
const topics = await useTopics(post.categoryId);
const topic = topics.value.find((e) => e.id === post.topicId)!;

const tags = await useTags();
const rawPostTags = post.tags.split(",");
const postTags = tags.value.filter((e) => rawPostTags.includes(e.id));

const pages = [
  {
    name: category.name,
    href: `/category/${category.id}`,
  },
  {
    name: topic.name,
    href: `/topic/${topic.id}`,
  },
];

const content = micromark(post.content);
</script>
