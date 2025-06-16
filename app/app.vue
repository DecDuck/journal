<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();

useHead({
  titleTemplate(title) {
    return title
      ? `${title} | ${runtimeConfig.public.whitelabel.title}`
      : runtimeConfig.public.whitelabel.title;
  },
});

await updateUser();
</script>
