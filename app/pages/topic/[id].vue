<template>
  <PostSearch :opts="{ topicId: topic.id }"
    >Search topic "{{ topic.name }}"</PostSearch
  >
</template>

<script setup lang="ts">
const route = useRoute();

const topicId = route.params.id!.toString();

const { topic } = await $journalFetch("/api/v1/topic", {
  query: { id: topicId },
});

useHead({
  title: "Topic",
});
</script>
