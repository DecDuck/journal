<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <div class="max-w-xl mx-auto">
      <h1
        class="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 dark:text-zinc-100 sm:text-5xl"
      >
        About
      </h1>
      <div
        class="mt-4 prose prose-sm prose-blue dark:prose-invert max-w-none"
        v-html="aboutHTML"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { micromark } from "micromark";

const about = await useAbout();
if (!about.value) throw createError({ statusCode: 404, fatal: true });
const aboutHTML = micromark(about.value);

useHead({
  title: "About",
});
</script>
