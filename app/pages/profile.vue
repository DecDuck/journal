<template>
  <div class="lg:flex lg:gap-x-16">
    <h1 class="sr-only">General Settings</h1>

    <aside
      class="flex overflow-x-auto border-b border-gray-900/5 lg:block lg:w-64 lg:flex-none lg:border-0"
    >
      <nav class="flex-none px-4 sm:px-6 lg:px-0">
        <ul
          role="list"
          class="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col"
        >
          <li v-for="item in navigation" :key="item.name">
            <NuxtLink
              :href="item.href"
              :class="[
                item.current
                  ? 'bg-gray-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600',
                'group flex gap-x-3 rounded-md py-2 pr-3 pl-2 text-sm/6 font-semibold',
              ]"
            >
              <component
                :is="item.icon"
                :class="[
                  item.current
                    ? 'text-blue-600'
                    : 'text-gray-400 group-hover:text-blue-600',
                  'size-6 shrink-0',
                ]"
                aria-hidden="true"
              />
              {{ item.name }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </aside>

    <main class="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
import {
  Cog6ToothIcon,
  FingerPrintIcon,
  UserCircleIcon,
} from "@heroicons/vue/24/outline";

const route = useRoute();

const navigation = computed(() => {
  const nav = [
    { name: "General", href: "/profile", icon: UserCircleIcon },
    { name: "Security", href: "/profile/security", icon: FingerPrintIcon },
    {
      name: "Settings",
      href: "/profile/settings",
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
</script>
