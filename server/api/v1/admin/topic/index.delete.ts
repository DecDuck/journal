import { type } from "arktype";
import { readJournalValidatedBody, throwingArktype } from "~~/server/arktype";
import { topic } from "~~/server/database/schema";
import { useAdminAuthenticated } from "~~/server/utils/session";

export const DeleteTopic = type({
  id: "string",
}).configure(throwingArktype);

export default defineEventHandler(async (h3) => {
  const body = await readJournalValidatedBody(h3, DeleteTopic);

  const drizzle = useDrizzle();
  const _user = await useAdminAuthenticated(h3, drizzle);

  await drizzle.delete(topic).where(eq(topic.id, body.id));

  setResponseStatus(h3, 201);
  return;
});
