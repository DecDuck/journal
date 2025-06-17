import { ArkErrors, type } from "arktype";
import { desc, lte } from "drizzle-orm";
import { category, post, reply, user } from "~~/server/database/schema";

export const FetchPost = type({
  id: "string",
});

export default defineEventHandler(async (h3) => {
  const drizzle = useDrizzle();
  const permissionLevel = await usePermissionLevel(h3, drizzle);

  const query = getQuery(h3);
  const validatedQuery = FetchPost(query);
  if (validatedQuery instanceof ArkErrors)
    throw createError({
      statusCode: 400,
      statusMessage: validatedQuery.summary,
    });

  const fetchedPost = await first(
    drizzle
      .select()
      .from(post)
      .where(
        and(
          eq(post.id, validatedQuery.id),
          lte(category.readPermission, permissionLevel)
        )
      )
      .innerJoin(category, eq(post.categoryId, category.id))
      .innerJoin(user, eq(post.authorId, user.id))
  );
  if (!fetchedPost)
    throw createError({ statusCode: 404, statusMessage: "Post not found" });

  const replies = await drizzle
    .select()
    .from(reply)
    .where(eq(reply.postId, fetchedPost.post.id))
    .orderBy(desc(reply.createdAt));

  return { post: fetchedPost.post, replies, author: fetchedPost.user };
});
