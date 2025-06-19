<template>
  <ModalTemplate v-model="realOpen">
    <template #default>
      <ArktypeForm
        :forminator="TopicForm"
        endpoint="/api/v1/admin/topic"
        :opts="{
          method: editMode ? 'PATCH' : 'POST',
          submitText: editMode ? 'Update' : 'Create',
          extra: {
            ...(editMode ? { id: props.existing?.id } : {}),
            categoryId: props.categoryId,
          },
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
import { TopicForm } from "~~/forms/topic";
import type { Topic } from "~~/server/utils/drizzle";

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
  categoryId: string;
  existing?: SerializeObject<Topic>;
}>();

const editMode = computed(() => !!props.existing);

const topics = await useTopics(props.categoryId);

function onFinish(topic: unknown) {
  const value = topic as SerializeObject<Topic>;

  open.value = false;
  if (editMode.value && props.existing) {
    const index = topics.value.findIndex((e) => e.id == props.existing!.id);
    if (index != -1) {
      topics.value[index] = value;
      return;
    }
  }
  topics.value.push(value);
}
</script>
