import type { SerializeObject } from "nitropack";
import type { Category, Tag, Topic } from "~~/server/utils/drizzle";
import { DateTime } from "luxon";

export type FileAttachment = { type: string; filename: string; size: number };

export const useCategories = async () => {
  // Not particularly typesafe but we need a way to check if it hasn't been initialised
  const state = useState<Array<SerializeObject<Category>>>(
    "categories",
    () => null as unknown as []
  );
  if (state.value === null) {
    const categories = await $fetch("/api/v1/category");
    state.value = categories;
  }
  return state;
};

export const useTags = async () => {
  // Not particularly typesafe but we need a way to check if it hasn't been initialised
  const state = useState<Array<SerializeObject<Tag>>>(
    "tags",
    () => null as unknown as []
  );
  if (state.value === null) {
    const categories = await $fetch("/api/v1/tags");
    state.value = categories;
  }
  return state;
};

export const useTopics = async (id: string) => {
  const state = useState<{ [key: string]: Array<SerializeObject<Topic>> }>(
    "topics",
    () => ({})
  );
  if (state.value[id] === undefined) {
    const topics = await $fetch<Array<SerializeObject<Topic>>>(
      "/api/v1/topics",
      {
        query: { categoryId: id },
      }
    );
    state.value[id] = topics;
  }
  return computed(() => state.value[id]!);
};

export const usePrivacyPolicy = async () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const state = useState<string | undefined>("privacyPolicy", () => null);
  if (state.value === null) {
    state.value = await $fetch("/api/v1/privacy");
  }

  return state;
};

export const useCodeOfConduct = async () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const state = useState<string | undefined>("conduct", () => null);
  if (state.value === null) {
    state.value = await $fetch("/api/v1/conduct");
  }

  return state;
};

export const useAbout = async () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const state = useState<string | undefined>("about", () => null);
  if (state.value === null) {
    state.value = await $fetch("/api/v1/about");
  }

  return state;
};

export function relativeTime(time: string | Date) {
  const jsDate = typeof time === "string" ? new Date(time) : time;
  const datetime = DateTime.fromJSDate(jsDate);
  return datetime.toRelative()!;
}

export const stringToColour = (str: string) => {
  let hash = 0;
  str.split("").forEach((char) => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  });
  let colour = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += value.toString(16).padStart(2, "0");
  }
  return colour;
};
