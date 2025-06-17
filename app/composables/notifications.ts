import { ExclamationTriangleIcon } from "@heroicons/vue/24/outline";
import { FetchError } from "ofetch";
import type { Component } from "vue";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  icon: Component;
  actions?: Array<{ name: string; url: string }>;
}

export const useNotifications = () =>
  useState<Array<NotificationItem>>("notifications", () => []);

export function createNotification(notification: Omit<NotificationItem, "id">) {
  if (!import.meta.client) return;
  const notifications = useNotifications();
  const id = crypto.randomUUID();
  notifications.value.push({ ...notification, id });
  setTimeout(() => {
    clearNotification(id);
  }, 10 * 1000);
}

export function createErrorNotification(action: string, e: unknown) {
  let message = (e as string).toString();
  if (e instanceof FetchError) {
    message = e.statusMessage ?? e.message ?? "An unknown error occurred.";
  }

  createNotification({
    title: action,
    description: message,
    icon: ExclamationTriangleIcon,
  });
}

export function clearNotification(id: string) {
  const notifications = useNotifications();
  const index = notifications.value.findIndex((e) => e.id == id);
  if (index == -1) return;

  notifications.value.splice(index, 1);
}
