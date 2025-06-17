<template>
  <div class="space-y-6">
    <div class="flex flex-col lg:flex-row gap-8">
      <CategorySelector v-model="category" />
      <TopicSelector
        v-if="category"
        v-model="topic"
        :category-id="category.id"
      />
    </div>
    <div v-if="category && topic">
      <ArktypeForm
        :forminator="PostForm"
        endpoint="/api/v1/post"
        :opts="{
          submitText: 'Post',
          extra: {
            topicId: topic.id,
            categoryId: category.id,
          },
        }"
        @submit="(post) => onPost(post)"
      />
    </div>
    <div v-else class="w-full py-4 flex items-center justify-center">
      <p class="text-sm text-zinc-400">
        Please select category and topic to start writing...
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SerializeObject } from "nitropack";
import { PostForm } from "~~/forms/post";
import type { Topic, Category, Post } from "~~/server/utils/drizzle";

useHead({
  title: "New Post",
});

const category = ref<SerializeObject<Category> | undefined>(undefined);
const topic = ref<SerializeObject<Topic> | undefined>(undefined);

const router = useRouter();

function onPost(value: unknown) {
  const post = value as SerializeObject<Post>;
  router.push(`/post/${post.id}`);
}
</script>
