import { count, desc, like, lte } from "drizzle-orm";
import { z } from "zod/v4";
import { category, post, topic, user } from "~~/server/database/schema";

const SearchQuery = z.object({
  q: z.string(),
  topicId: z.string().optional(),
});

export default definePaginatedEndpoint(
  SearchQuery,
  async (drizzle, options, permissions, offset, limit) => {
    const likeStr = `%${options.q.toLowerCase()}%`; // This SHOULD be an SQL injection vulnerability

    const query = and(
      or(
        like(sql`lower(${post.title})`, likeStr),
        like(sql`lower(${post.content})`, likeStr)
      ),
      lte(category.readPermission, permissions),
      options.topicId ? eq(post.topicId, options.topicId) : undefined
    );

    const posts = await drizzle
      .select()
      .from(post)
      .where(query)
      .innerJoin(category, eq(post.categoryId, category.id))
      .innerJoin(topic, eq(post.topicId, topic.id))
      .innerJoin(user, eq(post.authorId, user.id))
      .orderBy(desc(post.createdAt))
      .offset(offset)
      .limit(limit);

    const postCount = await first(
      drizzle
        .select({ count: count() })
        .from(post)
        .where(query)
        .innerJoin(category, eq(post.categoryId, category.id))
    );

    return { results: posts, count: postCount!.count };
  }
);
