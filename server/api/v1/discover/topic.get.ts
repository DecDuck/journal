import { lte } from "drizzle-orm";
import { z } from "zod/v4";
import { category, topic } from "~~/server/database/schema";
import { usePermissionLevel } from "~~/server/utils/session";
import { throwyZod } from "~~/server/validation";

const DiscoverTopics = z.object({
  limit: z.string().default("8"),
});

export default defineEventHandler(async (h3) => {
  const query = getQuery(h3);
  const body = throwyZod(DiscoverTopics.safeParse(query));

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
