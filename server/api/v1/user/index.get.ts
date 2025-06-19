import { z } from "zod/v4";
import { user } from "~~/server/database/schema";
import { throwyZod } from "~~/server/validation";

const FetchUser = z.object({
  id: z.string(),
});

export default defineEventHandler(async (h3) => {
  const query = getQuery(h3);
  const validatedQuery = throwyZod(FetchUser.safeParse(query));

  const drizzle = useDrizzle();
  const data = await first(
    drizzle.select().from(user).where(eq(user.id, validatedQuery.id))
  );

  if (!data)
    throw createError({ statusCode: 404, statusMessage: "User not found" });

  return data;
});
