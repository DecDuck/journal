import { ArkErrors, type } from "arktype";
import { user } from "~~/server/database/schema";

const FetchUser = type({
  id: "string",
});

export default defineEventHandler(async (h3) => {
  const query = getQuery(h3);
  const validatedQuery = FetchUser(query);
  if (validatedQuery instanceof ArkErrors)
    throw createError({
      statusCode: 400,
      statusMessage: validatedQuery.summary,
    });

  const drizzle = useDrizzle();
  const data = await first(
    drizzle.select().from(user).where(eq(user.id, validatedQuery.id))
  );

  if (!data)
    throw createError({ statusCode: 404, statusMessage: "User not found" });

  return data;
});
