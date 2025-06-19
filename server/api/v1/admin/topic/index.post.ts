import { TopicForm } from "~~/forms/topic";
import { readJournalValidatedBody } from "~~/server/validation";
import { topic } from "~~/server/database/schema";
import { useAdminAuthenticated } from "~~/server/utils/session";
import { z } from "zod/v4";

const CreateTopicValidator = TopicForm.validator.and(
  z.object({ categoryId: z.string() })
);

export default defineEventHandler(async (h3) => {
  const body = await readJournalValidatedBody(h3, CreateTopicValidator);

  const drizzle = useDrizzle();

  const _user = await useAdminAuthenticated(h3, drizzle);

  const newTopic = {
    id: randomUUID(20),
    name: body.name,
    description: body.description,
    categoryId: body.categoryId,
  } satisfies typeof topic.$inferInsert;

  const newlyCreatedTopic = await first(
    drizzle.insert(topic).values(newTopic).returning()
  );
  if (!newlyCreatedTopic) throw createError({ statusCode: 500 });

  return newlyCreatedTopic;
});
