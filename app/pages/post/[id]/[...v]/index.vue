<template>
  <div class="space-y-12">
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

    <div>
      <h1 class="text-4xl font-semibold">{{ post.title }}</h1>

      <div class="mt-2 flex items-center gap-x-2 text-xs">
        <time :datetime="post.createdAt" class="text-gray-500"
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

    <article class="flex gap-4">
      <div class="flex flex-col items-center">
        <img
          :src="useObject(author.avatar)"
          class="ring-[2px] p-1 ring-zinc-200 size-12 rounded-full"
        />
        <div class="w-[2px] bg-zinc-200 h-full" />
        <div class="size-3 aspect-square rounded-full bg-zinc-200" />
      </div>
      <div class="flex-1 w-full">
        <PostReplyContent
          :author="author"
          :content="content"
          :attachments="attachments"
        />
      </div>
      <div>
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
              <div class="w-px bg-gray-200" />
            </div>
            <div
              class="relative flex size-6 flex-none items-center justify-center bg-white"
            >
              <div
                class="size-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300"
              />
            </div>
            <p
              class="inline-flex items-center gap-x-1 py-0.5 text-xs/5 text-gray-600"
            >
              <img
                :src="useObject(activityItem.author.avatar)"
                class="size-4 rounded-full"
              />
              <NuxtLink
                :href="`/user/${activityItem.author.id}`"
                class="font-medium text-gray-900 hover:underline"
                >{{ activityItem.author.displayName }}</NuxtLink
              >
              {{ activityItem.type }}.
            </p>
            <time
              :datetime="activityItem.createdAt"
              class="flex-none py-0.5 text-xs/5 text-gray-400"
              >{{ relativeTime(activityItem.createdAt) }}</time
            >
          </li>
        </ul>
      </div>
    </article>

    <div class="space-y-8">
      <article v-for="reply in replies" :key="reply.id" class="flex gap-4">
        <div class="flex flex-col items-center">
          <img
            :src="useObject(reply.author.avatar)"
            class="ring-[2px] p-1 ring-zinc-200 size-12 rounded-full"
          />
          <div class="w-[2px] bg-zinc-200 h-full" />
          <div class="size-3 aspect-square rounded-full bg-zinc-200" />
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

    <div v-if="user" class="max-w-sm">
      <ArktypeForm
        :forminator="ReplyForm"
        endpoint="/api/v1/reply"
        :opts="{ submitText: 'Reply', extra: { postId: post.id } }"
        @submit="(reply) => onReply(reply)"
      />
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

const user = useUser();

const categories = await useCategories();
const category = categories.value.find((e) => e.id === post.categoryId)!;
const topics = await useTopics(post.categoryId);
const topic = topics.value.find((e) => e.id === post.topicId)!;

if (!route.params.v) {
  router.replace(
    `/post/${post.id}/${post.title
      .toLowerCase()
      .replaceAll(/[^a-zA-Z\d]/g, "-")}`
  );
}

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
