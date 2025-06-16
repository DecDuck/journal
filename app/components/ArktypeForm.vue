<template>
  <form
    method="POST"
    class="space-y-4"
    @submit.prevent="() => submit_wrapper()"
  >
    <div
      v-for="[fieldName, options] in props.forminator.descriptions"
      :key="fieldName"
    >
      <label
        :for="fieldName"
        class="block text-sm/6 font-medium text-gray-900"
        >{{ options.name }}</label
      >
      <div class="mt-2">
        <input
          :id="fieldName"
          v-model="result[fieldName]"
          :type="options.type ?? 'text'"
          :name="fieldName"
          :autocomplete="fieldName"
          required
          class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
        />
      </div>
      <p
        v-if="options.description"
        :class="[
          'text-xs/6 mt-1 leading-4',
          validationResult[fieldName] && result[fieldName]
            ? 'text-red-600'
            : 'text-gray-500',
        ]"
      >
        {{ options.description }}
      </p>
      <p
        v-else-if="validationResult[fieldName] && result[fieldName]"
        class="text-xs/6 mt-1 leading-4 text-red-600"
      >
        {{ validationResult[fieldName] }}
      </p>
    </div>

    <div v-if="formError" class="rounded-md bg-red-50 p-4">
      <div class="flex">
        <div class="shrink-0">
          <XCircleIcon class="size-5 text-red-400" aria-hidden="true" />
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">
            {{ formError }}
          </h3>
        </div>
      </div>
    </div>

    <div>
      <LoadingButton
        :loading="formLoading"
        :disabled="!validForm"
        type="submit"
        class="w-full"
      >
        {{ props.opts?.submitText ?? "Submit" }}
      </LoadingButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { XCircleIcon } from "@heroicons/vue/24/outline";
import { ArkErrors } from "arktype";
import { FetchError } from "ofetch";
import type { ForminatorResult } from "~~/forms/_form";

const props = defineProps<{
  forminator: ForminatorResult<unknown>;
  endpoint: string;
  opts?: { method?: "POST" | "PUT" | "PATCH"; submitText?: string };
}>();
const emit = defineEmits<{
  (e: "submit", value: unknown): void;
}>();

const result = ref<{ [key: string]: unknown }>({});

const validationResult = computed<{ [key: string]: string }>(() => {
  const results = props.forminator.validator(result.value);
  if (!(results instanceof ArkErrors)) {
    return {};
  }

  const errors: { [key: string]: string } = {};
  for (const error of results) {
    for (const path of error.path) {
      errors[path.toString()] = error.message;
    }
  }
  return errors;
});
const validForm = computed(
  () => Object.keys(validationResult.value).length == 0
);

const formLoading = ref(false);
const formError = ref<undefined | string>(undefined);
async function submit() {
  return await $journalFetch(props.endpoint, {
    body: result.value,
    method: props.opts?.method ?? "POST",
  });
}

function submit_wrapper() {
  if (!validForm.value) return;
  formLoading.value = true;
  submit()
    .catch((e) => {
      if (e instanceof FetchError) {
        formError.value =
          e.statusMessage ??
          e.message ??
          `An unknown error occurred. ${e.statusCode}`;
        return;
      }
      formError.value = e;
    })
    .then((e) => {
      emit("submit", e);
    })
    .finally(() => {
      formLoading.value = false;
    });
}
</script>
