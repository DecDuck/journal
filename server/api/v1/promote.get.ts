/**
 * Promotes the current user to an admin level
 */

import { z } from "zod/v4";
import { user } from "~~/server/database/schema";
import { useAuthenticated } from "~~/server/utils/session";
import { throwyZod } from "~~/server/validation";

const Promote = z.object({
  token: z.string(),
});

export default defineEventHandler(async (h3) => {
  const userId = await useAuthenticated(h3);
  const query = getQuery(h3);
  const body = throwyZod(Promote.safeParse(query));

  const runtimeConfig = useRuntimeConfig();
  if (body.token !== runtimeConfig.adminToken)
    throw createError({ statusCode: 403 });

  const drizzle = useDrizzle();
  await drizzle
    .update(user)
    .set({ permissionLevel: 999 })
    .where(eq(user.id, userId));

  return "<h1>Promoted.</h1>";
});
