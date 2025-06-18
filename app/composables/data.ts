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
    const categories = await $journalFetch("/api/v1/category");
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
    const categories = await $journalFetch("/api/v1/tags");
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
    const topics = await $journalFetch<Array<SerializeObject<Topic>>>(
      "/api/v1/topic",
      {
        query: { categoryId: id },
      }
    );
    state.value[id] = topics;
  }
  return computed(() => state.value[id]!);
};

export function relativeTime(time: string | Date) {
  const jsDate = typeof time === "string" ? new Date(time) : time;
  const datetime = DateTime.fromJSDate(jsDate);
  return datetime.toRelative()!;
}
