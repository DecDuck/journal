<template>
  <ModalTemplate v-model="realOpen">
    <template #default>
      <ArktypeForm
        :forminator="TagForm"
        endpoint="/api/v1/admin/tag"
        :opts="{
          method: editMode ? 'PATCH' : 'POST',
          submitText: editMode ? 'Update' : 'Create',
          extra: editMode ? { id: props.existing?.id } : {},
        }"
        :dft="props.existing"
        @submit="(category) => onFinish(category)"
      />
    </template>
    <template #buttons="{ close }">
      <SimpleButton @click="() => close()"> Cancel </SimpleButton>
    </template>
  </ModalTemplate>
</template>

<script setup lang="ts">
import type { SerializeObject } from "nitropack";
import { TagForm } from "~~/forms/tag";
import type { Tag } from "~~/server/utils/drizzle";

const open = defineModel<boolean | object>();

const realOpen = computed({
  get() {
    return !!open.value;
  },
  set(v) {
    open.value = v;
  },
});

const props = defineProps<{
  existing?: SerializeObject<Tag>;
}>();

const editMode = computed(() => !!props.existing);

const tags = await useTags();

function onFinish(category: unknown) {
  const value = category as SerializeObject<Tag>;

  open.value = false;
  if (editMode.value && props.existing) {
    const index = tags.value.findIndex((e) => e.id == props.existing!.id);
    if (index != -1) {
      tags.value[index] = value;
      return;
    }
  }
  tags.value.push(value);
}
</script>
