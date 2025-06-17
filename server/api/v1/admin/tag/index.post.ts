import { TagForm } from "~~/forms/tag";
import { readJournalValidatedBody, throwingArktype } from "~~/server/arktype";
import { tag } from "~~/server/database/schema";
import { useAdminAuthenticated } from "~~/server/utils/session";

export default defineEventHandler(async (h3) => {
  const body = await readJournalValidatedBody(
    h3,
    TagForm.validator.configure(throwingArktype)
  );

  const drizzle = useDrizzle();

  const _user = await useAdminAuthenticated(h3, drizzle);

  const newTag = {
    id: randomUUID(20),
    name: body.name,
  } satisfies typeof tag.$inferInsert;

  const newlyCreatedTag = await first(
    drizzle.insert(tag).values(newTag).returning()
  );
  if (!newlyCreatedTag) throw createError({ statusCode: 500 });

  return newlyCreatedTag;
});
