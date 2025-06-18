<template>
  <!--
    This example requires updating your template:

    ```
    <html class="h-full bg-zinc-100">
    <body class="h-full">
    ```
  -->
  <div class="min-h-full flex flex-col flex-col-reverse">
    <main>
      <div class="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 py-4">
        <div class="rounded-lg bg-white px-5 py-6 shadow-sm sm:px-6">
          <slot />
        </div>
      </div>
    </main>

    <div class="bg-zinc-900">
      <Disclosure v-slot="{ open }" as="nav" class="bg-zinc-800">
        <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div class="border-b border-zinc-700">
            <div class="flex h-16 items-center justify-between px-4 sm:px-0">
              <div class="flex items-center">
                <div class="shrink-0">
                  <AppIcon class="size-8" />
                </div>
                <div class="hidden md:block">
                  <div class="ml-10 flex items-baseline space-x-4">
                    <div v-for="item in navigation" :key="item.name">
                      <component
                        :is="item.desktopComponent"
                        v-if="item.desktopComponent"
                        :current="item.current"
                      />
                      <NuxtLink
                        v-else
                        :href="item.href"
                        :class="[
                          item.current
                            ? 'bg-zinc-900 text-white'
                            : 'text-zinc-300 hover:bg-zinc-700 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium',
                        ]"
                        :aria-current="item.current ? 'page' : undefined"
                        >{{ item.name }}</NuxtLink
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div class="hidden md:block">
                <div v-if="user" class="ml-4 flex items-center md:ml-6">
                  <button
                    type="button"
                    class="relative rounded-full bg-zinc-800 p-1 text-zinc-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-800 focus:outline-hidden"
                  >
                    <span class="absolute -inset-1.5" />
                    <span class="sr-only">View notifications</span>
                    <BellIcon class="size-6" aria-hidden="true" />
                  </button>

                  <!-- Profile dropdown -->
                  <Menu as="div" class="relative ml-3">
                    <div>
                      <MenuButton
                        class="relative cursor-pointer flex max-w-xs items-center rounded-full bg-zinc-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-800 focus:outline-hidden"
                      >
                        <span class="absolute -inset-1.5" />
                        <span class="sr-only">Open user menu</span>
                        <img
                          class="size-8 rounded-full"
                          :src="useObject(user.avatar)"
                          alt=""
                        />
                      </MenuButton>
                    </div>
                    <transition
                      enter-active-class="transition ease-out duration-100"
                      enter-from-class="transform opacity-0 scale-95"
                      enter-to-class="transform opacity-100 scale-100"
                      leave-active-class="transition ease-in duration-75"
                      leave-from-class="transform opacity-100 scale-100"
                      leave-to-class="transform opacity-0 scale-95"
                    >
                      <MenuItems
                        class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-hidden"
                      >
                        <MenuItem
                          v-for="item in userNavigation"
                          :key="item.name"
                          v-slot="{ active, close }"
                        >
                          <NuxtLink
                            :href="item.href"
                            :class="[
                              active ? 'bg-zinc-100 outline-hidden' : '',
                              'block px-4 py-2 text-sm text-zinc-700',
                            ]"
                            @click="() => close()"
                            >{{ item.name }}</NuxtLink
                          >
                        </MenuItem>
                      </MenuItems>
                    </transition>
                  </Menu>
                </div>
                <div v-else class="ml-4 flex items-center md:ml-6">
                  <NuxtLink
                    href="/signin"
                    class="text-zinc-300 hover:bg-zinc-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                    >Sign in</NuxtLink
                  >
                  <NuxtLink
                    href="/register"
                    class="text-zinc-300 hover:bg-zinc-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                    >Register</NuxtLink
                  >
                </div>
              </div>
              <div class="-mr-2 flex md:hidden">
                <!-- Mobile menu button -->
                <DisclosureButton
                  class="relative inline-flex items-center justify-center rounded-md bg-zinc-800 p-2 text-zinc-400 hover:bg-zinc-700 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-800 focus:outline-hidden"
                >
                  <span class="absolute -inset-0.5" />
                  <span class="sr-only">Open main menu</span>
                  <Bars3Icon
                    v-if="!open"
                    class="block size-6"
                    aria-hidden="true"
                  />
                  <XMarkIcon v-else class="block size-6" aria-hidden="true" />
                </DisclosureButton>
              </div>
            </div>
          </div>
        </div>

        <DisclosurePanel class="border-b border-zinc-700 md:hidden">
          <div class="space-y-1 px-2 py-3 sm:px-3">
            <DisclosureButton
              v-for="item in navigation"
              :key="item.name"
              :as="NuxtLink"
              :href="item.href"
              :class="[
                item.current
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-300 hover:bg-zinc-700 hover:text-white',
                'block rounded-md px-3 py-2 text-base font-medium',
              ]"
              :aria-current="item.current ? 'page' : undefined"
              >{{ item.name }}</DisclosureButton
            >
          </div>
          <div v-if="user" class="border-t border-zinc-700 pt-4 pb-3">
            <div class="flex items-center px-5">
              <div class="shrink-0">
                <img
                  class="size-10 rounded-full"
                  :src="useObject(user.avatar)"
                  alt=""
                />
              </div>
              <div class="ml-3">
                <div class="text-base/5 font-semibold text-white">
                  {{ user.displayName }}
                </div>
                <div class="text-sm font-medium text-zinc-400">
                  @{{ user.username }}
                </div>
              </div>
              <button
                type="button"
                class="relative ml-auto shrink-0 rounded-full bg-zinc-800 p-1 text-zinc-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-800 focus:outline-hidden"
              >
                <span class="absolute -inset-1.5" />
                <span class="sr-only">View notifications</span>
                <BellIcon class="size-6" aria-hidden="true" />
              </button>
            </div>
            <div class="mt-3 space-y-1 px-2">
              <DisclosureButton
                v-for="item in userNavigation"
                :key="item.name"
                :as="NuxtLink"
                :href="item.href"
                class="block rounded-md px-3 py-2 text-base font-medium text-zinc-400 hover:bg-zinc-700 hover:text-white"
                >{{ item.name }}</DisclosureButton
              >
            </div>
          </div>
          <div v-else class="border-t border-zinc-700 pt-4 pb-3">
            <div class="space-y-1 px-2">
              <DisclosureButton
                :as="NuxtLink"
                href="/signin"
                class="block rounded-md px-3 py-2 text-base font-medium text-zinc-400 hover:bg-zinc-700 hover:text-white"
                >Sign in</DisclosureButton
              >
              <DisclosureButton
                :as="NuxtLink"
                href="/register"
                class="block rounded-md px-3 py-2 text-base font-medium text-zinc-400 hover:bg-zinc-700 hover:text-white"
                >Register</DisclosureButton
              >
            </div>
          </div>
        </DisclosurePanel>
      </Disclosure>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NavCategoryButton, NuxtLink } from "#components";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/vue";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/vue/24/outline";

const user = useUser();

const route = useRoute();

// This is mildly cursed
const navigation = computed(() => {
  const nav = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    {
      name: "Categories",
      href: "/category",
      desktopComponent: NavCategoryButton,
    },
    { name: "New Post", href: "/new" },
  ];

  // eslint-disable-next-line prefer-const
  let [_, activeIndex] = nav.reduce(
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
  if (activeIndex == 0 && route.path.length > 1) {
    activeIndex = -1;
  }

  return nav.map((e, i) => ({ ...e, current: i == activeIndex }));
});
const userNavigation = computed(() => [
  ...(user.value?.permissionLevel ?? 0 >= 900
    ? [{ name: "Admin Dashboard", href: "/admin" }]
    : []),
  { name: "Your Profile", href: `/user/${user.value?.id}` },
  { name: "Settings", href: "/profile" },
  { name: "Sign out", href: "/signout" },
]);
</script>
