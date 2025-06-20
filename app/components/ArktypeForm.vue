<template>
  <form
    method="POST"
    class="space-y-4 relative"
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
          v-if="!options.type || !specialEditors[options.type]"
          :id="fieldName"
          v-model="result[fieldName]"
          :type="options.type ?? 'text'"
          :name="fieldName"
          :autocomplete="fieldName"
          :placeholder="options.placeholder"
          :required="options.default !== undefined"
          class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
        />
        <component
          :is="specialEditors[options.type]"
          v-else
          v-model="result[fieldName]"
          :configuration="options.configuration"
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

    <div v-if="hasTurnstile" class="w-full flex items-center justify-center">
      <div ref="turnstile" />
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

    <div v-if="formLoading" class="absolute inset-0 bg-white/30" />
  </form>
</template>

<script setup lang="ts">
import { XCircleIcon } from "@heroicons/vue/24/outline";
import { FetchError } from "ofetch";
import type { ForminatorResult } from "~~/forms/_form";
import MarkdownEditor from "./Form/MarkdownEditor.vue";
import TagEditor from "./Form/TagEditor.vue";
import AttachmentsEditor from "./Form/AttachmentsEditor.vue";
import ShortMarkdownEditor from "./Form/ShortMarkdownEditor.vue";
import { $ZodError } from "zod/v4/core";
import type { ZodSafeParseResult } from "zod/v4";
import { arkyZod } from "~~/server/validation";

type UnknownObject = { [key: string]: unknown };

const specialEditors: { [key: string]: Component } = {
  markdown: MarkdownEditor,
  shortMarkdown: ShortMarkdownEditor,
  tags: TagEditor,
  attachments: AttachmentsEditor,
};

const props = defineProps<{
  forminator: ForminatorResult<{
    safeParse: (data: unknown) => ZodSafeParseResult<unknown>;
  }>;
  endpoint: string;
  dft?: UnknownObject;
  opts?: {
    method?: "POST" | "PUT" | "PATCH";
    submitText?: string;
    extra?: object;
  };
}>();
const emit = defineEmits<{
  (e: "submit", value: unknown): void;
}>();

function makeEmpty(v: { type?: string }) {
  switch (v.type) {
    case undefined:
    case "text":
    case "password":
      return "";
  }
  return undefined;
}

const empties = Object.fromEntries(
  props.forminator.descriptions.map((e) => [e[0], makeEmpty(e[1])])
);
const dft = Object.fromEntries(
  props.dft
    ? Object.entries(props.dft).filter((e) => e[1] !== null)
    : props.forminator.descriptions
        .filter((e) => e[1].default !== undefined)
        .map((e) => [e[0], e[1].default])
);

const result = ref<UnknownObject>(Object.assign({}, empties, dft));

const validationResult = computed<{ [key: string]: string }>(() => {
  const results = arkyZod(props.forminator.validator.safeParse(result.value));
  if (!(results instanceof $ZodError)) {
    return {};
  }

  const errors: { [key: string]: string } = {};
  for (const error of results.issues) {
    for (const path of error.path) {
      errors[path.toString()] = error.message;
    }
  }
  return errors;
});
const validForm = computed(
  () =>
    Object.keys(validationResult.value).length == 0 &&
    (hasTurnstile ? turnstileToken.value !== undefined : true)
);

/* Cloudflare Turnstile logic */
const cftokenConst = "cftoken";
const hasTurnstile =
  props.forminator.descriptions.find((e) => e[0] == cftokenConst) !== undefined;

const turnstile = ref<HTMLDivElement>();
const turnstileWidgetId = ref<string | undefined>(undefined);
const turnstileToken = ref<string | undefined>(undefined);
onMounted(() => {
  if (hasTurnstile && import.meta.client) {
    result.value[cftokenConst] = cftokenConst; // To bypass Arktype validator for this

    if (!turnstile.value)
      throw new Error(
        "Could not initialise Turnstile but it is required - render component does not exist at mount-time"
      );
    const globalTurnstile = (
      window as unknown as {
        turnstile: {
          render: (
            mountpoint: string | HTMLDivElement,
            options: {
              sitekey: string;
              callback: (token: string) => void;
            }
          ) => string;
        };
      }
    ).turnstile;

    const runtimeConfig = useRuntimeConfig();

    turnstileWidgetId.value = globalTurnstile.render(turnstile.value, {
      sitekey: runtimeConfig.public.turnstileSitekey,
      callback(token) {
        turnstileToken.value = token;
      },
    });
  }
});
/* End Turnstile logic */

/* Attachment Logic */
const attachmentFields = props.forminator.descriptions.filter(
  (e) => e[1].type === "attachments"
);
/* End Attachment Logic */

const formLoading = ref(false);
const formError = ref<undefined | string>(undefined);
async function submit() {
  if (hasTurnstile) {
    result.value[cftokenConst] = turnstileToken.value;
  }

  let body: object = {
    ...result.value,
    ...props.opts?.extra,
  };

  if (attachmentFields.length > 0) {
    for (const [field] of attachmentFields) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete (body as UnknownObject)[field];
    }

    const newBody = new FormData();

    for (const [key, value] of Object.entries(body)) {
      newBody.set(key, JSON.stringify(value));
    }

    for (const [field] of attachmentFields) {
      const files = result.value[field] as File[] | undefined;
      if (!files) continue;
      for (const file of files) {
        newBody.append(field, file);
      }
    }

    body = newBody;
  }

  return await $journalFetch(props.endpoint, {
    body,
    method: props.opts?.method ?? "POST",
  });
}

function submit_wrapper() {
  if (!validForm.value) return;
  formLoading.value = true;
  submit()
    .then(
      (e) => {
        result.value = dft;

        emit("submit", e);
      },
      (e) => {
        if (e instanceof FetchError) {
          formError.value =
            e.statusMessage ??
            e.message ??
            `An unknown error occurred. ${e.statusCode}`;
          return;
        }
        formError.value = e;
      }
    )
    .finally(() => {
      formLoading.value = false;
    });
}
</script>
