<template>
  <div class="flex flex-col">
    <div>
      <slot :data="value" />
    </div>
    <div
      class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
    >
      <div class="flex flex-1 justify-between items-center sm:hidden">
        <LoadingButton
          :loading="!value"
          :disabled="!showBack"
          :style="'pagination'"
          class="rounded-md text-zinc-700"
          @click="() => page--"
          >Previous</LoadingButton
        >
        <LoadingButton
          :loading="!value"
          :disabled="!showForward"
          :style="'pagination'"
          class="rounded-md text-zinc-700"
          @click="() => page++"
          >Next</LoadingButton
        >
      </div>
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing
            {{ " " }}
            <span class="font-medium">{{ page + 1 }}</span>
            of
            {{ " " }}
            <span class="font-medium">{{ value?.pages }}</span>
            {{ " " }}
            page(s)
          </p>
        </div>
        <div>
          <nav
            class="isolate inline-flex -space-x-px rounded-md shadow-xs"
            aria-label="Pagination"
          >
            <LoadingButton
              :loading="!value"
              :style="'pagination'"
              :disabled="!showBack"
              class="rounded-l-md"
              @click="() => page--"
            >
              <span class="sr-only">Previous</span>
              <ChevronLeftIcon class="size-5" aria-hidden="true" />
            </LoadingButton>
            <!-- Current: "z-10 bg-blue-600 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" -->
            <button
              v-for="pageIndex in pageIndexes[0]"
              :key="pageIndex"
              :aria-current="pageIndex == page ? 'page' : undefined"
              :class="[
                'cursor-pointer',
                pageIndex == page
                  ? 'relative z-10 inline-flex items-center bg-blue-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                  : 'relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex',
              ]"
              @click="() => setPage(pageIndex)"
            >
              {{ pageIndex + 1 }}
            </button>
            <span
              v-if="pageIndexes[1] && pageIndexes[1].before"
              class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 ring-inset focus:outline-offset-0"
              >...</span
            >
            <button
              v-for="pageIndex in pageIndexes[1]?.arr"
              :key="pageIndex"
              :aria-current="pageIndex == page ? 'page' : undefined"
              :class="[
                'cursor-pointer',
                pageIndex == page
                  ? 'relative z-10 inline-flex items-center bg-blue-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                  : 'relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex',
              ]"
              @click="() => setPage(pageIndex)"
            >
              {{ pageIndex + 1 }}
            </button>
            <span
              v-if="pageIndexes[1] ? pageIndexes[1].after : pageIndexes[2]"
              class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 ring-inset focus:outline-offset-0"
              >...</span
            >
            <button
              v-for="pageIndex in pageIndexes[2]"
              :key="pageIndex"
              :aria-current="pageIndex == page ? 'page' : undefined"
              :class="[
                'cursor-pointer',
                pageIndex == page
                  ? 'relative z-10 inline-flex items-center bg-blue-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                  : 'relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex',
              ]"
              @click="() => setPage(pageIndex)"
            >
              {{ pageIndex + 1 }}
            </button>
            <LoadingButton
              :loading="!value"
              :style="'pagination'"
              :disabled="!showForward"
              class="rounded-r-md"
              @click="() => page++"
            >
              <span class="sr-only">Next</span>
              <ChevronRightIcon class="size-5" aria-hidden="true" />
            </LoadingButton>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";

const props = defineProps<{
  endpoint: string;
  opts?: { [key: string]: string };
  count?: number;
}>();

const value = ref<
  { results: Array<unknown> | undefined; pages: number } | undefined
>(undefined);

async function update(pageNumber: number) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  value.value = await $journalFetch(props.endpoint, {
    query: {
      ...props.opts,
      page: pageNumber.toString(),
      count: props.count ?? 8,
    },
  });
}

const page = ref(0);
const showBack = computed(() => page.value !== 0);
const showForward = computed(() =>
  value.value ? value.value.pages >= page.value + 1 : false
);

type MiddleConfiguration = { before: boolean; after: boolean; arr: number[] };

const pageIndexes = computed<
  [number[], MiddleConfiguration | undefined, number[] | undefined]
>(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  () => {
    if (!value.value?.pages) return [[], undefined, undefined];
    if (value.value.pages <= 5)
      return [
        Array(value.value.pages)
          .fill(0)
          .map((_, i) => i),
        undefined,
        undefined,
      ];

    const last = value.value.pages - 1;

    function calculateMiddle(): MiddleConfiguration | undefined {
      switch (page.value) {
        case 0:
        case last:
          return undefined;

        case 1:
          return { before: false, after: true, arr: [2] };

        case last - 1:
          return { before: true, after: false, arr: [last - 2] };

        case 2:
          return { before: false, after: true, arr: [2, 3] };

        case last - 2:
          return { before: true, after: false, arr: [last - 2] };

        default:
          return {
            before: true,
            after: true,
            arr: [page.value - 1, page.value, page.value + 1],
          };
      }
    }

    return [[0, 1], calculateMiddle(), [last - 1, last]];
  }
);

await update(page.value);

watch(page, (v) => {
  value.value!.results = undefined;
  update(v);
});

if (props.opts) {
  watch(() => props.opts, () => {
    value.value!.results = undefined;
    update(page.value);
  });
}

function setPage(index: number) {
  if (index < 0 || index >= value.value!.pages) {
    return;
  }
  page.value = index;
}
</script>
