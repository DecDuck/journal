import { type } from "~~/server/arktype";
import { desc, lte } from "drizzle-orm";
import { category, post, topic, user } from "~~/server/database/schema";
import { usePermissionLevel } from "~~/server/utils/session";

const DiscoverPosts = type({
  limit: "string = '4'",
});

export default defineEventHandler(async (h3) => {
  const query = getQuery(h3);
  const body = DiscoverPosts(query);

  const limit = Math.min(parseInt(body.limit), 20); // Hard limit of 20

  const drizzle = useDrizzle();
  const permissionLevel = await usePermissionLevel(h3, drizzle);

  const posts = await drizzle
    .select()
    .from(post)
    .where(lte(category.readPermission, permissionLevel))
    .leftJoin(topic, eq(post.topicId, topic.id))
    .leftJoin(category, eq(topic.categoryId, category.id))
    .leftJoin(user, eq(post.authorId, user.id))
    .orderBy(desc(post.createdAt))
    .limit(limit);

  return posts;
});
