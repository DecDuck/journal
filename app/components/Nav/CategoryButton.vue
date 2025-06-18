<template>
  <Popover ref="popover" v-slot="{ close }" class="isolate z-[1500] shadow-sm">
    <div>
      <PopoverButton
        :class="[
          props.current
            ? 'bg-zinc-900 text-white'
            : 'text-zinc-300 hover:bg-zinc-700 hover:text-white',
          'inline-flex items-center gap-x-1 rounded-md px-3 py-2 text-sm font-medium',
        ]"
      >
        Categories
        <ChevronDownIcon class="size-5" aria-hidden="true" />
      </PopoverButton>
    </div>

    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <PopoverPanel
        class="absolute inset-x-0 top-16 bg-zinc-800 pt-0 shadow-lg ring-1 ring-white/5"
      >
        <div
          class="mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-6 py-10 lg:grid-cols-2 lg:px-8"
        >
          <div class="grid grid-cols-2 gap-x-6 sm:gap-x-8">
            <div>
              <NuxtLink
                to="/category"
                class="text-sm/6 font-semibold text-zinc-100 pl-2"
                @click="() => close()"
              >
                Categories &rarr;
              </NuxtLink>
              <div class="mt-6 flow-root">
                <div class="-my-2">
                  <NuxtLink
                    v-for="item in categories"
                    :key="item.id"
                    :href="`/category/${item.id}`"
                    class="group flex gap-x-2 items-center py-3 px-2 rounded text-sm/6 font-semibold text-zinc-300 hover:text-zinc-100 hover:bg-zinc-700"
                    @click="() => close()"
                  >
                    <PaperClipIcon
                      class="size-5 flex-none text-zinc-400 group-hover:text-zinc-300"
                      aria-hidden="true"
                    />
                    {{ item.name }}
                  </NuxtLink>
                </div>
              </div>
            </div>
            <div>
              <h3 class="text-sm/6 font-semibold text-zinc-200 pl-2">Topics</h3>
              <div class="mt-6 flow-root">
                <div class="-my-2">
                  <NuxtLink
                    v-for="{ topic, category } in discoverTopics"
                    :key="topic.id"
                    :href="`/topic/${topic.id}`"
                    class="group rounded flex items-center gap-x-2 px-2 py-3 text-sm/6 font-semibold text-zinc-300 hover:text-zinc-100 hover:bg-zinc-700"
                    @click="() => close()"
                  >
                    <GlobeAltIcon
                      class="size-5 flex-none text-zinc-500 group-hover:text-zinc-400"
                      aria-hidden="true"
                    />
                    {{ topic.name }}
                    <span class="-ml-1 text-xs text-zinc-500 truncate"
                      >({{ category!.name }})</span
                    >
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="discoverPosts.length > 0"
            class="grid grid-cols-1 gap-10 sm:gap-8 lg:grid-cols-2 lg:grid-rows-2"
          >
            <h3 class="sr-only">Recent posts</h3>
            <article
              v-for="{ post, user } in discoverPosts"
              :key="post.id"
              class="group relative isolate flex max-w-2xl flex-col gap-x-8 gap-y-6 sm:flex-row sm:items-start lg:flex-col lg:items-stretch"
            >
              <div>
                <div class="inline-flex items-center gap-x-2">
                  <div class="flex items-center gap-x-1">
                  <img
                    :src="useObject(user!.avatar)"
                    class="size-5 rounded-full"
                  />
                  <p class="text-sm text-zinc-300">{{ user!.displayName }}</p>
                </div>
                <div class="size-[3px] bg-zinc-500 rounded-full" />
                <div class="flex items-center gap-x-4">
                  <time
                    :datetime="post.createdAt"
                    class="text-sm/6 text-zinc-400"
                    >{{ relativeTime(post.createdAt) }}</time
                  >
                </div>
                </div>
                
                <h4
                  class="mt-1 text-md font-semibold text-zinc-300 group-hover:text-zinc-100"
                >
                  <NuxtLink
                    :href="`/post/${post.id}`"
                    @click.prevent="() => close()"
                  >
                    <span class="absolute inset-0" />
                    {{ post.title }}
                  </NuxtLink>
                </h4>
              </div>
            </article>
          </div>
          <div v-else class="flex items-center justify-center">
            <p class="text-zinc-600 text-sm font-semibold">No posts (yet).</p>
          </div>
        </div>
      </PopoverPanel>
    </transition>
  </Popover>
</template>

<script setup lang="ts">
import { NuxtLink } from "#components";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";
import { GlobeAltIcon, PaperClipIcon } from "@heroicons/vue/24/outline";

const router = useRouter();

const categories = await useCategories();

const discoverTopics = await $journalFetch("/api/v1/discover/topic?limit=8");

const discoverPosts = await $journalFetch("/api/v1/discover/post?limit=4");

const props = defineProps<{ current: boolean }>();

const popover = useTemplateRef<InstanceType<typeof Popover>>("popover");

router.afterEach(() => {
  // This works. Don't touch.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  popover.value?.$props.close();
});
</script>
