import { type } from "arktype";
import { lte } from "drizzle-orm";
import { category, topic } from "~~/server/database/schema";
import { usePermissionLevel } from "~~/server/utils/session";

const FetchTopic = type({
  categoryId: "string",
});

export default defineEventHandler(async (h3) => {
  const query = getQuery(h3);
  const options = FetchTopic(query);

  const drizzle = useDrizzle();
  const permissionLevel = await usePermissionLevel(h3, drizzle);

  const topics = await drizzle
    .select()
    .from(topic)
    .where(
      and(
        eq(topic.categoryId, options.categoryId),
        lte(category.readPermission, permissionLevel)
      )
    )
    .leftJoin(category, eq(topic.categoryId, category.id));

  return topics.map((e) => e.topic);
});
