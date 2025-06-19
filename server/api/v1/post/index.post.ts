import type { Type } from "arktype";
import { lte } from "drizzle-orm";
import { PostForm } from "~~/forms/post";
import {
  readJournalValidatedMultipart,
  throwingArktype,
} from "~~/server/arktype";
import { category, post, topic } from "~~/server/database/schema";
import { validateTurnstile } from "~~/server/utils/turnstile";

const CreatePostValidator = (
  PostForm.validator as Type<typeof PostForm.validator.infer>
)
  .and({
    categoryId: "string",
    topicId: "string",
  })
  .configure(throwingArktype);

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
    CreatePostValidator
  );

  const turnstileResult = await validateTurnstile(body.cftoken);
  if (!turnstileResult)
    throw createError({
      statusCode: 400,
      statusMessage: "Failed to validate Turnstile token.",
    });

  const postCategory = await first(
    drizzle
      .select()
      .from(category)
      .where(
        and(
          eq(category.id, body.categoryId),
          lte(category.writePermission, permissionLevel)
        )
      )
  );
  if (!postCategory)
    throw createError({ statusCode: 404, statusMessage: "Unknown category." });

  const postTopic = await first(
    drizzle.select().from(topic).where(eq(topic.id, body.topicId))
  );
  if (!postTopic)
    throw createError({ statusCode: 404, statusMessage: "Unknown topic." });

  const newPost = {
    id: randomUUID(20),
    title: body.title,
    content: body.content,
    tags: body.tags.join(","),
    attachments: files.attachments?.map((e) => e.pathname).join(",") ?? "",
    topicId: postTopic.id,
    categoryId: postCategory.id,
    authorId: userId,
  } satisfies typeof post.$inferInsert;

  const newlyCreatedPost = await first(
    drizzle.insert(post).values(newPost).returning()
  );
  if (!newlyCreatedPost)
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create post",
    });

  return newlyCreatedPost;
});
