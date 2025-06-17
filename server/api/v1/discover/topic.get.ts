import { type } from "arktype";
import { lte } from "drizzle-orm";
import { category, topic } from "~~/server/database/schema";
import { usePermissionLevel } from "~~/server/utils/session";

const DiscoverTopics = type({
  limit: "string = '8'",
});

export default defineEventHandler(async (h3) => {
  const query = getQuery(h3);
  const body = DiscoverTopics(query);

  const limit = Math.min(parseInt(body.limit), 20); // Hard limit of 20

  const drizzle = useDrizzle();
  const permissionLevel = await usePermissionLevel(h3, drizzle);

  const topics = await drizzle
    .select()
    .from(topic)
    .where(lte(category.readPermission, permissionLevel))
    .leftJoin(category, eq(topic.categoryId, category.id))
    .limit(limit);

  return topics;
});
