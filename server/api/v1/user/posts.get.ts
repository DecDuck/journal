import { count, desc, lte } from "drizzle-orm";
import { z } from "zod/v4";
import { category, post, topic } from "~~/server/database/schema";

export default definePaginatedEndpoint(
  z.object({
    id: z.string(),
  }),
  async (drizzle, { id }, permissions, offset, pageSize) => {
    return {
      results: await drizzle
        .select()
        .from(post)
        .where(
          and(eq(post.authorId, id), lte(category.readPermission, permissions))
        )
        .innerJoin(category, eq(post.categoryId, category.id))
        .innerJoin(topic, eq(post.topicId, topic.id))
        .orderBy(desc(post.createdAt))
        .offset(offset)
        .limit(pageSize),
      count:
        (
          await first(
            drizzle
              .select({ count: count() })
              .from(post)
              .where(
                and(
                  eq(post.authorId, id),
                  lte(category.readPermission, permissions)
                )
              )
              .innerJoin(category, eq(post.categoryId, category.id))
          )
        )?.count ?? 0,
    };
  }
);
