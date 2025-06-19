import { type } from "arktype";
import { count } from "drizzle-orm";
import { user } from "~~/server/database/schema";

export default definePaginatedEndpoint(
  type({}),
  async (drizzle, _options, permissions, offset, pageSize) => {
    if (!(permissions >= 900)) throw createError({ statusCode: 403 });

    const users = await drizzle
      .select()
      .from(user)
      .orderBy(user.createdAt)
      .offset(offset)
      .limit(pageSize);

    const userCount = await first(
      drizzle.select({ count: count() }).from(user)
    );
    if (!userCount)
      throw createError({
        statusCode: 500,
        statusMessage: "Could not fetch user count",
      });

    return {
      results: users,
      count: userCount.count,
    };
  }
);
