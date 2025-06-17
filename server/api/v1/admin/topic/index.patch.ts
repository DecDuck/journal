import type { Type } from "arktype";
import { type } from "arktype";
import { TopicForm } from "~~/forms/topic";
import { readJournalValidatedBody, throwingArktype } from "~~/server/arktype";
import { topic } from "~~/server/database/schema";
import { useAdminAuthenticated } from "~~/server/utils/session";

const PatchTopicValidator = (
  TopicForm.validator as Type<typeof TopicForm.validator.infer>
)
  .partial()
  .and(type({ id: "string" }))
  .configure(throwingArktype);

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
