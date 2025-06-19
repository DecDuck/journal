import { lte } from "drizzle-orm";
import { z } from "zod/v4";
import { category, topic } from "~~/server/database/schema";
import { usePermissionLevel } from "~~/server/utils/session";
import { throwyZod } from "~~/server/validation";

const FetchTopic = z.object({
  categoryId: z.string(),
});

export default defineEventHandler(async (h3) => {
  const query = getQuery(h3);
  const options = throwyZod(FetchTopic.safeParse(query));

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
