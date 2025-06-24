import { asc, lte } from "drizzle-orm";
import { z } from "zod/v4";
import { category, post, reply, user } from "~~/server/database/schema";
import { mapAttachments } from "~~/server/utils/blob";
import { throwyZod } from "~~/server/validation";

export const FetchPost = z.object({
  id: z.string(),
});

export default defineEventHandler(async (h3) => {
  const drizzle = useDrizzle();
  const permissionLevel = await usePermissionLevel(h3, drizzle);

  const query = getQuery(h3);
  const validatedQuery = throwyZod(FetchPost.safeParse(query));

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
    .orderBy(asc(reply.createdAt))
    .innerJoin(user, eq(reply.authorId, user.id));

  const attachmentMetadata = await mapAttachments(
    fetchedPost.post.attachments?.split(",") ?? []
  );

  const mappedReplies = await Promise.all(
    replies.map(async (e) => {
      const attachments = e.reply.attachments?.split(",") ?? [];

      const attachmentMetadata = await mapAttachments(attachments);

      return {
        ...e.reply,
        author: e.user,
        attachments: attachmentMetadata,
      };
    })
  );

  return {
    post: fetchedPost.post,
    replies: mappedReplies,
    author: fetchedPost.user,
    attachments: attachmentMetadata,
  };
});
