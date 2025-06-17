import { user } from "~~/server/database/schema";
import {
  GLOBAL_SESSION_CONFIG,
  useAuthenticated,
} from "~~/server/utils/session";

export default defineEventHandler(async (h3) => {
  const userId = await useAuthenticated(h3);
  const drizzle = useDrizzle();

  const fetchedUser = await first(
    drizzle.select().from(user).where(eq(user.id, userId)).limit(1)
  );

  if (!fetchedUser) {
    clearSession(h3, GLOBAL_SESSION_CONFIG);
    throw createError({ statusCode: 403 });
  }

  return fetchedUser;
});
