import { CategoryForm } from "~~/forms/category";
import { readJournalValidatedBody, throwingArktype } from "~~/server/validation";
import { category } from "~~/server/database/schema";
import { useAdminAuthenticated } from "~~/server/utils/session";

export default defineEventHandler(async (h3) => {
  const body = await readJournalValidatedBody(
    h3,
    CategoryForm.validator.configure(throwingArktype)
  );

  const drizzle = useDrizzle();
 
  const _user = await useAdminAuthenticated(h3, drizzle);

  const newCategory = {
    id: randomUUID(20),
    name: body.name,
    description: body.description,
    readPermission: body.readPermission,
    writePermission: body.writePermission,
    adminPermission: body.adminPermission,
    repository: body.repository,
  } satisfies typeof category.$inferInsert;

  const newlyCreatedCategory = await first(
    drizzle.insert(category).values(newCategory).returning()
  );
  if (!newlyCreatedCategory) throw createError({ statusCode: 500 });

  return newlyCreatedCategory;
});
