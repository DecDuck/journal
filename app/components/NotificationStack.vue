<template>
  <!-- Global notification live region, render this permanently at the end of the document -->
  <div
    aria-live="assertive"
    class="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
  >
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <!-- Notification panel, dynamically insert this into the live region when it needs to be displayed -->
      <TransitionGroup
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5"
        >
          <div class="p-4">
            <div class="flex items-start">
              <div class="shrink-0">
                <component
                  :is="notification.icon"
                  class="size-6 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-gray-900">
                  {{ notification.title }}
                </p>
                <p class="mt-1 text-sm text-gray-500">
                  {{ notification.description }}
                </p>
                <div v-if="notification.actions" class="mt-3 flex space-x-7">
                  <NuxtLink
                    v-for="action in notification.actions"
                    :key="action.url"
                    :href="action.url"
                    type="button"
                    class="rounded-md bg-white text-sm font-medium text-blue-600 hover:text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-hidden"
                  >
                    {{ action.name }}
                  </NuxtLink>
                </div>
              </div>
              <div class="ml-4 flex shrink-0">
                <button
                  type="button"
                  class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-hidden"
                  @click="() => clearNotification(notification.id)"
                >
                  <span class="sr-only">Close</span>
                  <XMarkIcon class="size-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>
<script setup lang="ts">
import { XMarkIcon } from "@heroicons/vue/24/outline";

const notifications = useNotifications();
</script>
