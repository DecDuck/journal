import { users } from "~~/server/database/schema";
import {
  GLOBAL_SESSION_CONFIG,
  useAuthenticated,
} from "~~/server/utils/session";

export default defineEventHandler(async (h3) => {
  const userId = await useAuthenticated(h3);
  const drizzle = useDrizzle();

  const user = await first(
    drizzle.select().from(users).where(eq(users.id, userId)).limit(1)
  );

  if (!user) {
    clearSession(h3, GLOBAL_SESSION_CONFIG);
    throw createError({ statusCode: 403 });
  }

  return user;
});
