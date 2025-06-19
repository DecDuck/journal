import { CategoryForm } from "~~/forms/category";
import { readJournalValidatedBody } from "~~/server/validation";
import { category } from "~~/server/database/schema";
import { useAdminAuthenticated } from "~~/server/utils/session";
import { z } from "zod/v4";

const PatchCategoryValidator = CategoryForm.validator
  .partial()
  .and(z.object({ id: z.string() }));

export default defineEventHandler(async (h3) => {
  const body = await readJournalValidatedBody(h3, PatchCategoryValidator);

  const drizzle = useDrizzle();

  const _user = await useAdminAuthenticated(h3, drizzle);

  const result = await first(
    drizzle
      .update(category)
      .set({
        name: body.name,
        description: body.description,
        readPermission: body.readPermission,
        writePermission: body.writePermission,
        adminPermission: body.adminPermission,
        repository: body.repository,
      })
      .where(eq(category.id, body.id))
      .returning()
  );
  if (!result)
    throw createError({
      statusCode: 404,
      statusMessage: "Category not found.",
    });

  return result;
});
