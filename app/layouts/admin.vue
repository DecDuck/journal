<template>
  <!--
    This example requires updating your template:

    ```
    <html class="h-full bg-white">
    <body class="h-full">
    ```
  -->
  <div v-if="user && user.permissionLevel >= 900">
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog class="relative z-50 lg:hidden" @close="sidebarOpen = false">
        <TransitionChild
          as="template"
          enter="transition-opacity ease-linear duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-zinc-900/80" />
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild
            as="template"
            enter="transition ease-in-out duration-300 transform"
            enter-from="-translate-x-full"
            enter-to="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leave-from="translate-x-0"
            leave-to="-translate-x-full"
          >
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild
                as="template"
                enter="ease-in-out duration-300"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="ease-in-out duration-300"
                leave-from="opacity-100"
                leave-to="opacity-0"
              >
                <div
                  class="absolute top-0 left-full flex w-16 justify-center pt-5"
                >
                  <button
                    type="button"
                    class="-m-2.5 p-2.5"
                    @click="sidebarOpen = false"
                  >
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon class="size-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>

              <!-- Sidebar component, swap this element with another sidebar if you like -->
              <div
                class="flex grow flex-col gap-y-5 overflow-y-auto bg-zinc-900 px-6 pb-2 ring-1 ring-white/10"
              >
                <div class="flex h-16 shrink-0 items-center">
                  <AppIcon class="h-8 w-auto" />
                </div>
                <nav class="flex flex-1 flex-col">
                  <ul role="list" class="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" class="-mx-2 space-y-1">
                        <li v-for="item in navigation" :key="item.name">
                          <NuxtLink
                            :href="item.href"
                            :class="[
                              item.current
                                ? 'bg-zinc-800 text-white'
                                : 'text-zinc-400 hover:bg-zinc-800 hover:text-white',
                              'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                            ]"
                          >
                            <component
                              :is="item.icon"
                              class="size-6 shrink-0"
                              aria-hidden="true"
                            />
                            {{ item.name }}
                          </NuxtLink>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <div class="text-xs/6 font-semibold text-zinc-400">
                        Categories
                      </div>
                      <ul role="list" class="-mx-2 mt-2 space-y-1">
                        <li v-for="category in categoryNav" :key="category.id">
                          <NuxtLink
                            :href="category.href"
                            :class="[
                              category.current
                                ? 'bg-zinc-800 text-white'
                                : 'text-zinc-400 hover:bg-zinc-800 hover:text-white',
                              'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                            ]"
                          >
                            <span
                              class="uppercase flex size-6 shrink-0 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-[0.625rem] font-medium text-zinc-400 group-hover:text-white"
                              >{{ category.name[0] }}</span
                            >
                            <span class="truncate">{{ category.name }}</span>
                          </NuxtLink>
                        </li>
                      </ul>
                      <p
                        v-if="categoryNav.length == 0"
                        class="text-zinc-500 text-xs"
                      >
                        No categories
                      </p>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div
      class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col"
    >
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-zinc-900 px-6">
        <div class="flex h-16 shrink-0 items-center">
          <AppIcon class="h-8 w-auto" />
        </div>
        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li v-for="item in navigation" :key="item.name">
                  <NuxtLink
                    :href="item.href"
                    :class="[
                      item.current
                        ? 'bg-zinc-800 text-white'
                        : 'text-zinc-400 hover:bg-zinc-800 hover:text-white',
                      'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                    ]"
                  >
                    <component
                      :is="item.icon"
                      class="size-6 shrink-0"
                      aria-hidden="true"
                    />
                    {{ item.name }}
                  </NuxtLink>
                </li>
              </ul>
            </li>
            <li>
              <div class="text-xs/6 font-semibold text-zinc-400">
                Categories
              </div>
              <ul role="list" class="-mx-2 mt-2 space-y-1">
                <li v-for="category in categoryNav" :key="category.id">
                  <NuxtLink
                    :href="category.href"
                    :class="[
                      category.current
                        ? 'bg-zinc-800 text-white'
                        : 'text-zinc-400 hover:bg-zinc-800 hover:text-white',
                      'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                    ]"
                  >
                    <span
                      class="uppercase flex size-6 shrink-0 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-[0.625rem] font-medium text-zinc-400 group-hover:text-white"
                      >{{ category.name[0] }}</span
                    >
                    <span class="truncate">{{ category.name }}</span>
                  </NuxtLink>
                </li>
              </ul>
              <p v-if="categoryNav.length == 0" class="text-zinc-500 text-xs">
                No categories
              </p>
            </li>
            <li class="-mx-6 mt-auto">
              <NuxtLink
                href="/"
                class="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-white hover:bg-zinc-800"
              >
                <img
                  class="size-8 rounded-full bg-zinc-800"
                  :src="useObject(user.avatar)"
                  alt=""
                />
                <div>
                  <span aria-hidden="true">{{ user.displayName }}</span>
                  <p class="text-xs text-zinc-400">&larr; Go back</p>
                </div>
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div
      class="sticky top-0 z-40 flex items-center gap-x-6 bg-zinc-900 px-4 py-4 shadow-xs sm:px-6 lg:hidden"
    >
      <button
        type="button"
        class="-m-2.5 p-2.5 text-zinc-400 lg:hidden"
        @click="sidebarOpen = true"
      >
        <span class="sr-only">Open sidebar</span>
        <Bars3Icon class="size-6" aria-hidden="true" />
      </button>
      <div class="flex-1 text-sm/6 font-semibold text-white">
        {{ navigation.find((e) => e.current)?.name }}
      </div>
      <NuxtLink href="/">
        <span class="sr-only">Back</span>
        <HomeIcon class="size-5 text-zinc-500" />
      </NuxtLink>
    </div>

    <main class="py-10 lg:pl-72">
      <div class="px-4 sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>
  </div>
  <NotAuthorized v-else />
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import {
  Bars3Icon,
  Cog6ToothIcon,
  HomeIcon,
  InboxStackIcon,
  TagIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";

const route = useRoute();
const router = useRouter();

// This is mildly cursed (see default.vue)
const navigation = computed(() => {
  const nav = [
    { name: "Dashboard", href: "/admin", icon: HomeIcon },
    { name: "Users", href: "/admin/users", icon: UserGroupIcon },
    {
      name: "Categories",
      href: "/admin/category",
      icon: InboxStackIcon,
    },
    {
      name: "Tags",
      href: "/admin/tag",
      icon: TagIcon,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Cog6ToothIcon,
    },
  ];

  const [_, activeIndex] = nav.reduce(
    (prev, current, index) => {
      if (route.fullPath.startsWith(current.href)) {
        const length = current.href.length;
        if (length > prev[0]!) {
          return [length, index];
        }
      }
      return prev;
    },
    // Length, index
    [-1, -1]
  );

  return nav.map((e, i) => ({ ...e, current: i == activeIndex }));
});

const categories = await useCategories();
const categoryNav = computed(() => {
  const nav = categories.value;

  const [_, activeIndex] = nav.reduce(
    (prev, current, index) => {
      const href = `/admin/category/${current.id}`;
      if (route.fullPath.startsWith(href)) {
        const length = href.length;
        if (length > prev[0]!) {
          return [length, index];
        }
      }
      return prev;
    },
    // Length, index
    [-1, -1]
  );

  return nav.map((e, i) => ({
    ...e,
    current: i == activeIndex,
    href: `/admin/category/${e.id}`,
  }));
});

const user = useUser();

const sidebarOpen = ref(false);
router.afterEach(() => {
  sidebarOpen.value = false;
});
</script>
