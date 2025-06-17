import type { Type } from "arktype";
import { type } from "arktype";
import { CategoryForm } from "~~/forms/category";
import { readJournalValidatedBody, throwingArktype } from "~~/server/arktype";
import { category } from "~~/server/database/schema";
import { useAdminAuthenticated } from "~~/server/utils/session";

const PatchCategoryValidator = (
  CategoryForm.validator as Type<typeof CategoryForm.validator.infer>
)
  .partial()
  .and(type({ id: "string" }))
  .configure(throwingArktype);

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
