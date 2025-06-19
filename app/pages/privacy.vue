<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <div class="max-w-xl mx-auto">
      <p class="text-base/7 font-semibold text-blue-600">
        {{ runtimeConfig.public.whitelabel.title }}
      </p>
      <h1
        class="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl"
      >
        Privacy Policy
      </h1>
      <div class="mt-4 prose prose-sm prose-blue max-w-none" v-html="privacyPolicyHTML" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { micromark } from "micromark";

const privacyPolicy = await usePrivacyPolicy();
if (!privacyPolicy.value) throw createError({ statusCode: 404, fatal: true });
const privacyPolicyHTML = micromark(privacyPolicy.value);

const runtimeConfig = useRuntimeConfig();

useHead({
  title: "Privacy Policy",
});
</script>
