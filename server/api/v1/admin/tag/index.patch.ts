import type { Type } from "arktype";
import { type } from "arktype";
import { TagForm } from "~~/forms/tag";
import { readJournalValidatedBody, throwingArktype } from "~~/server/arktype";
import { tag } from "~~/server/database/schema";
import { useAdminAuthenticated } from "~~/server/utils/session";

const PatchTagValidator = (
  TagForm.validator as Type<typeof TagForm.validator.infer>
)
  .partial()
  .and(type({ id: "string" }))
  .configure(throwingArktype);

export default defineEventHandler(async (h3) => {
  const body = await readJournalValidatedBody(h3, PatchTagValidator);

  const drizzle = useDrizzle();

  const _user = await useAdminAuthenticated(h3, drizzle);

  const result = await first(
    drizzle
      .update(tag)
      .set({
        name: body.name,
      })
      .where(eq(tag.id, body.id))
      .returning()
  );
  if (!result)
    throw createError({
      statusCode: 404,
      statusMessage: "Tag not found.",
    });

  return result;
});
