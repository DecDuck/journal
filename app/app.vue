<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator />
  <NuxtLayout class="dark">
    <NuxtPage />
  </NuxtLayout>
  <NotificationStack />
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
