<!-- eslint-disable vue/no-v-html -->
<template>
  <p class="text-xs font-bold text-zinc-400 space-x-2">
    <NuxtLink
      :href="`/user/${author.id}`"
      class="text-blue-600 hover:underline"
      >{{ author.displayName }}</NuxtLink
    >
    <PermissionBadge :level="author.permissionLevel" />
  </p>
  <div class="mt-1 prose prose-blue" v-html="content" />

  <div class="mt-8 py-4 border-t border-zinc-200">
    <div
      v-if="props.attachments && props.attachments.length > 0"
      class="flex flex-row flex-wrap gap-2"
    >
      <FileWidget
        v-for="file in attachments"
        :key="file.filename"
        :file="file"
        :download-url="useObject(file.downloadId)"
      />
    </div>
    <p v-else class="text-zinc-400 text-sm">No attachments.</p>
  </div>
</template>

<script setup lang="ts">
import type { SerializeObject } from "nitropack";
import type { User } from "~~/server/utils/drizzle";

const props = defineProps<{
  author: SerializeObject<User>;
  content: string;
  attachments?: Array<FileAttachment & { downloadId: string }>;
}>();
</script>
