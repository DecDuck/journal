import { lte } from "drizzle-orm";
import { z } from "zod/v4";
import { category, topic } from "~~/server/database/schema";
import { usePermissionLevel } from "~~/server/utils/session";
import { throwyZod } from "~~/server/validation";

const FetchTopic = z.object({
  id: z.string(),
});

export default defineEventHandler(async (h3) => {
  const query = getQuery(h3);
  const options = throwyZod(FetchTopic.safeParse(query));

  const drizzle = useDrizzle();
  const permissionLevel = await usePermissionLevel(h3, drizzle);

  const fetchedTopic = await first(
    drizzle
      .select()
      .from(topic)
      .where(
        and(
          eq(topic.id, options.id),
          lte(category.readPermission, permissionLevel)
        )
      )
      .innerJoin(category, eq(topic.categoryId, category.id))
  );

  if (!fetchedTopic)
    throw createError({ statusCode: 404, statusMessage: "Topic not found." });

  return fetchedTopic;
});
