<template>
  <div class="space-y-12">
    <nav class="flex" aria-label="Breadcrumb">
      <ol role="list" class="flex items-center space-x-4">
        <li>
          <div>
            <NuxtLink
              href="/"
              class="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            >
              <HomeIcon class="size-5 shrink-0" aria-hidden="true" />
              <span class="sr-only">Home</span>
            </NuxtLink>
          </div>
        </li>
        <li v-for="page in pages" :key="page.name">
          <div class="flex items-center">
            <ChevronRightIcon
              class="size-5 shrink-0 text-gray-400 dark:text-gray-500"
              aria-hidden="true"
            />
            <NuxtLink
              :href="page.href"
              class="ml-4 text-sm font-medium text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              >{{ page.name }}</NuxtLink
            >
          </div>
        </li>
      </ol>
    </nav>

    <div>
      <h1 class="text-4xl font-semibold text-gray-900 dark:text-zinc-100">
        {{ post.title }}
      </h1>

      <div class="mt-2 flex items-center gap-x-2 text-xs">
        <time
          :datetime="post.createdAt"
          class="text-gray-500 dark:text-gray-400"
          >Posted {{ relativeTime(post.createdAt) }}</time
        >
        <NuxtLink
          v-for="tag in postTags"
          :key="tag.id"
          :href="`/tag/${tag.id}`"
          class="inline-flex items-center rounded-md bg-blue-100 hover:bg-blue-300 px-2 py-1 text-xs font-medium text-blue-700 blue:text-blue-900"
        >
          {{ tag.name }}
        </NuxtLink>
      </div>
    </div>

    <div class="flex gap-4 lg:px-4">
      <div class="flex-1 w-full space-y-8">
        <article class="flex gap-3 lg:gap-4">
          <div class="flex flex-col items-center">
            <img
              :src="useObject(author.avatar)"
              class="ring-[2px] lg:p-1 ring-zinc-200 dark:ring-zinc-700 size-6 lg:size-12 rounded-full"
            />
            <div class="w-[2px] bg-zinc-200 dark:bg-zinc-700 h-full" />
            <div
              class="size-3 aspect-square rounded-full bg-zinc-200 dark:bg-zinc-700"
            />
          </div>
          <div class="flex-1 w-full">
            <span class="font-mono text-zinc-100">
              {{ category }}:

              {{ post.categoryId }}

              /

              {{ topic }}:

              {{ post.topicId }}
            </span>
            <PostReplyContent
              :author="author"
              :content="content"
              :attachments="attachments"
            />
          </div>
        </article>

        <article v-for="reply in replies" :key="reply.id" class="flex gap-4">
          <div class="flex flex-col items-center">
            <img
              :src="useObject(reply.author.avatar)"
              class="ring-[2px] p-1 ring-zinc-200 dark:ring-zinc-700 size-12 rounded-full"
            />
            <div class="w-[2px] bg-zinc-200 dark:bg-zinc-700 h-full" />
            <div
              class="size-3 aspect-square rounded-full bg-zinc-200 dark:bg-zinc-700"
            />
          </div>
          <div class="flex-1 w-full">
            <PostReplyContent
              :author="reply.author"
              :content="reply.content"
              :attachments="reply.attachments"
            />
            <span class="text-xs text-zinc-400">{{
              relativeTime(reply.createdAt)
            }}</span>
          </div>
        </article>
      </div>
      <div class="hidden lg:block">
        <ul role="list" class="space-y-6">
          <li
            v-for="(activityItem, activityItemIdx) in activity"
            :key="activityItem.id"
            class="relative flex gap-x-4"
          >
            <div
              :class="[
                activityItemIdx === activity.length - 1 ? 'h-6' : '-bottom-6',
                'absolute top-0 left-0 flex w-6 justify-center',
              ]"
            >
              <div class="w-px bg-gray-200 dark:bg-zinc-700" />
            </div>
            <div
              class="relative flex size-6 flex-none items-center justify-center bg-white dark:bg-zinc-900"
            >
              <div
                class="size-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 ring-1 ring-gray-300 dark:ring-zinc-600"
              />
            </div>
            <p
              class="inline-flex items-center gap-x-1 py-0.5 text-xs/5 text-gray-600 dark:text-zinc-400"
            >
              <img
                :src="useObject(activityItem.author.avatar)"
                class="size-4 rounded-full"
              />
              <NuxtLink
                :href="`/user/${activityItem.author.id}`"
                class="font-medium text-gray-900 dark:text-zinc-100 hover:underline"
                >{{ activityItem.author.displayName }}</NuxtLink
              >
              {{ activityItem.type }}.
            </p>
            <time
              :datetime="activityItem.createdAt"
              class="flex-none py-0.5 text-xs/5 text-gray-400 dark:text-zinc-600"
              >{{ relativeTime(activityItem.createdAt) }}</time
            >
          </li>
        </ul>
      </div>
    </div>

    <div v-if="user" class="max-w-lg">
      <ArktypeForm
        :forminator="ReplyForm"
        endpoint="/api/v1/reply"
        :opts="{ submitText: 'Reply', extra: { postId: post.id } }"
        @submit="(reply) => onReply(reply)"
      />
    </div>
    <div
      v-else
      class="shadow-sm p-4 rounded-lg text-sm bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
    >
      <p>
        <NuxtLink
          href="/signin"
          class="hover:underline text-blue-600 dark:text-blue-500 hover:text-blue-500 dark:hover:text-blue-600"
          >Sign in &rarr;</NuxtLink
        >
        to reply to this conversation.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronRightIcon, HomeIcon } from "@heroicons/vue/24/outline";
import { micromark } from "micromark";
import { relativeTime } from "~/composables/data";
import { ReplyForm } from "~~/forms/reply";

const route = useRoute();
const router = useRouter();
const {
  post,
  replies: rawReplies,
  author,
  attachments,
} = await $journalFetch("/api/v1/post", {
  query: { id: route.params.id },
});
const replies = ref(rawReplies);

useHead({
  title: post.title,
});

const user = useUser();

const categories = await useCategories();
const category = categories.value.find((e) => e.id === post.categoryId);
const topics = await useTopics(post.categoryId);
const topic = topics.value.find((e) => e.id === post.topicId);

if (!route.params.v) {
  router.replace({
    path: `/post/${post.id}/${post.title
      .toLowerCase()
      .replaceAll(/[^a-zA-Z\d]/g, "-")}`,
    replace: true,
  });
}

const tags = await useTags();
const rawPostTags = post.tags.split(",");
const postTags = tags.value.filter((e) => rawPostTags.includes(e.id));

const pages = [
  {
    name: category?.name ?? "Unknown category",
    href: category ? `/category/${category.id}` : "#",
  },
  {
    name: topic?.name ?? "Unknown topic",
    href: topic ? `/topic/${topic.id}` : "#",
  },
];

const content = micromark(post.content);

const activity = computed(() => [
  { ...post, author, type: "posted" },
  ...replies.value.map((e) => ({ ...e, type: "replied" })),
]);

function onReply(value: unknown) {
  replies.value.push({
    // I don't want to type this
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(value as any),
    author: user.value!,
  });
}
</script>
