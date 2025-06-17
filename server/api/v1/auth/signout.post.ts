import type { JournalSession } from "~~/server/utils/session";
import { GLOBAL_SESSION_CONFIG } from "~~/server/utils/session";

export default defineEventHandler(async (h3) => {
  const session = await useSession<JournalSession>(h3, GLOBAL_SESSION_CONFIG);
  const userId = session.data.userId;
  if (!userId) throw createError({ statusCode: 403 });

  await session.clear();

  await setResponseStatus(h3, 201);

  return;
});
