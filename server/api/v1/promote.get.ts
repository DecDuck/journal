/**
 * Promotes the current user to an admin level
 */

import { type } from "arktype";
import { throwingArktype } from "~~/server/arktype";
import { users } from "~~/server/database/schema";
import { useAuthenticated } from "~~/server/utils/session";

const Promote = type({
  token: "string",
}).configure(throwingArktype);

export default defineEventHandler<{ body: typeof Promote.infer }>(
  async (h3) => {
    const userId = await useAuthenticated(h3);
    const query = getQuery(h3);
    const body = Promote(query);

    const runtimeConfig = useRuntimeConfig();
    if (body.token !== runtimeConfig.adminToken)
      throw createError({ statusCode: 403 });

    const drizzle = useDrizzle();
    await drizzle
      .update(users)
      .set({ permissionLevel: 999 })
      .where(eq(users.id, userId));

    setResponseStatus(h3, 201);
    return;
  }
);
