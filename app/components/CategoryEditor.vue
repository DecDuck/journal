<template>
  <ModalTemplate v-model="open">
    <template #default>
      <ArktypeForm
        :forminator="CategoryForm"
        endpoint="/api/v1/admin/category"
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
import { CategoryForm } from "~~/forms/category";
import type { Category } from "~~/server/utils/drizzle";

const open = defineModel<boolean>();

const props = defineProps<{
  existing?: SerializeObject<Category>;
}>();

const editMode = computed(() => !!props.existing);

const categories = await useCategories();

function onFinish(category: unknown) {
  const value = category as SerializeObject<Category>;

  open.value = false;
  if (editMode.value && props.existing) {
    const index = categories.value.findIndex((e) => e.id == props.existing!.id);
    if (index != -1) {
      categories.value[index] = value;
      return;
    }
  }
  categories.value.push(value);
}
</script>
