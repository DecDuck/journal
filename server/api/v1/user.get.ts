import { users } from "~~/server/database/schema";
import { GLOBAL_SESSION_CONFIG, JournalSession } from "~~/server/utils/session";

export default defineEventHandler(async (h3) => {
  const session = await useSession<JournalSession>(h3, GLOBAL_SESSION_CONFIG);
  const userId = session.data.userId;
  if (!userId) throw createError({ statusCode: 403 });

  const drizzle = useDrizzle();

  const [user] = await drizzle
    .selectDistinct()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)
    .all();

  if (!user) {
    clearSession(h3, GLOBAL_SESSION_CONFIG);
    throw createError({ statusCode: 403 });
  }

  return user;
});
