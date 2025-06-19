<!-- eslint-disable vue/no-v-html -->
<template>
  <article class="relative group cursor-pointer shadow-sm px-4 py-3 rounded">
    <div class="flex flex-wrap items-center gap-x-3">
      <h1 class="text-lg font-semibold text-zinc-900 group-hover:text-zinc-500">
        {{ post.title }}
      </h1>
      <p class="text-sm text-zinc-400">
        {{ relativeTime(post.createdAt) }}
      </p>
    </div>
    <div v-if="user" class="inline-flex items-center gap-x-0.5">
      <img :src="useObject(user.avatar)" class="size-4 rounded-full" />
      <p class="text-xs text-zinc-600">{{ user.displayName }}</p>
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
      <div class="prose prose-sm prose-blue" v-html="micromark(post.content)" />
      <div class="absolute inset-0 bg-linear-to-b from-transparent to-white" />
    </div>
    <NuxtLink class="absolute inset-0" :href="`/post/${post.id}`" />
  </article>
</template>

<script setup lang="ts">
import { ChevronRightIcon, HomeIcon } from "@heroicons/vue/24/outline";
import { micromark } from "micromark";
import type { SerializeObject } from "nitropack";
import type { Category, Post, Topic, User } from "~~/server/utils/drizzle";

defineProps<{
  post: SerializeObject<Post>;
  category: SerializeObject<Category>;
  topic: SerializeObject<Topic>;
  user?: SerializeObject<User>;
}>();
</script>
