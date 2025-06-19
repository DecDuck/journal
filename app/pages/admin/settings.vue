<template>
  <ArktypeForm
    :forminator="AdminForm"
    endpoint="/api/v1/admin/keys"
    :dft="keys"
    @submit="(v) => (keys = v as any)"
  />
</template>

<script setup lang="ts">
import { AdminForm } from "~~/forms/admin";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const keys = ref(await $journalFetch("/api/v1/admin/keys"));

definePageMeta({
  layout: "admin",
});
</script>
