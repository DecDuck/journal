import { lte } from "drizzle-orm";
import { ReplyForm } from "~~/forms/reply";
import { readJournalValidatedMultipart } from "~~/server/validation";
import { category, post, reply } from "~~/server/database/schema";
import { z } from "zod/v4";

const CreateReplyValidator = ReplyForm.validator.and(
  z.object({
    postId: z.string(),
  })
);

export default defineEventHandler(async (h3) => {
  const drizzle = useDrizzle();
  const permissionLevel = await usePermissionLevel(h3, drizzle);
  if (permissionLevel == -1)
    throw createError({
      statusCode: 403,
      statusMessage: "Must be signed in to post.",
    });

  const userId = await useAuthenticated(h3);

  const { body, files } = await readJournalValidatedMultipart(
    h3,
    CreateReplyValidator
  );

  const replyPost = await first(
    drizzle
      .select()
      .from(post)
      .where(
        and(
          eq(post.id, body.postId),
          lte(category.readPermission, permissionLevel)
        )
      )
      .innerJoin(category, eq(category.id, post.categoryId))
  );
  if (!replyPost)
    throw createError({ statusCode: 404, statusMessage: "Unknown post." });

  const newPost = {
    id: randomUUID(20),
    content: body.content,
    attachments: files.attachments?.map((e) => e.pathname).join(",") ?? "",
    authorId: userId,
    postId: body.postId,
  } satisfies typeof reply.$inferInsert;

  const newlyCreatedReply = await first(
    drizzle.insert(reply).values(newPost).returning()
  );
  if (!newlyCreatedReply)
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create post",
    });

  return {
    ...newlyCreatedReply,
    attachments: await mapAttachments(
      newlyCreatedReply.attachments?.split(",") ?? []
    ),
  };
});
