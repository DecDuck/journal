import { readJournalValidatedBody } from "~~/server/validation";
import { category } from "~~/server/database/schema";
import { useAdminAuthenticated } from "~~/server/utils/session";
import { z } from "zod/v4";

export const DeleteCategory = z.object({
  id: z.string(),
});

export default defineEventHandler(async (h3) => {
  const body = await readJournalValidatedBody(h3, DeleteCategory);

  const drizzle = useDrizzle();
  const _user = await useAdminAuthenticated(h3, drizzle);

  await drizzle.delete(category).where(eq(category.id, body.id));

  setResponseStatus(h3, 201);
  return;
});
