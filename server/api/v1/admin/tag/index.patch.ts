import { TagForm } from "~~/forms/tag";
import { readJournalValidatedBody } from "~~/server/validation";
import { tag } from "~~/server/database/schema";
import { useAdminAuthenticated } from "~~/server/utils/session";
import { z } from "zod/v4";

const PatchTagValidator = TagForm.validator
  .partial()
  .and(z.object({ id: z.string() }));

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
