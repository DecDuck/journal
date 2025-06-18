<template>
  <span
    v-if="level >= 900"
    class="inline-flex items-center rounded-md bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700"
    >Admin</span
  >
  <span
    v-else-if="level >= 500"
    class="inline-flex items-center rounded-md bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-700"
    >Manager</span
  >
  <span
    v-else-if="level >= 100"
    class="inline-flex items-center rounded-md bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-700"
    >Moderator</span
  >
  <!--
  <span
    v-else
    class="inline-flex items-center rounded-md bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-600"
    >User</span
  >
  -->
</template>

<script setup lang="ts">
defineProps<{ level: number }>();
</script>
