import { TopicForm } from "~~/forms/topic";
import { readJournalValidatedBody } from "~~/server/validation";
import { topic } from "~~/server/database/schema";
import { useAdminAuthenticated } from "~~/server/utils/session";
import { z } from "zod/v4";

const PatchTopicValidator = TopicForm.validator
  .partial()
  .and(z.object({ id: z.string() }));

export default defineEventHandler(async (h3) => {
  const body = await readJournalValidatedBody(h3, PatchTopicValidator);

  const drizzle = useDrizzle();

  const _user = await useAdminAuthenticated(h3, drizzle);

  const result = await first(
    drizzle
      .update(topic)
      .set({
        name: body.name,
        description: body.description,
      })
      .where(eq(topic.id, body.id))
      .returning()
  );
  if (!result)
    throw createError({
      statusCode: 404,
      statusMessage: "Category not found.",
    });

  return result;
});
