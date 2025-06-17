import { tag } from "~~/server/database/schema";

export default defineEventHandler(async () => {
  const drizzle = useDrizzle();

  const tags = await drizzle.select().from(tag);

  return tags;
});
