<template>
  <div>{{ topic }}</div>
</template>

<script setup lang="ts">
const route = useRoute();

const topic = await useTopics(route.params.id?.toString() ?? "");
</script>
