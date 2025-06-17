import { type } from "arktype";
import type { H3Event } from "h3";
import { users } from "../database/schema";

const runtimeConfig = useRuntimeConfig();

export const GLOBAL_SESSION_CONFIG = {
  name: "journalsession",
  password: runtimeConfig.sessionSecret,
} satisfies Parameters<typeof useSession>[1];

export const JournalSession = type({
  userId: "string",
});

export type JournalSession = Partial<typeof JournalSession.infer>;

export async function useAdminAuthenticated(
  h3: H3Event,
  drizzle: ReturnType<typeof useDrizzle>
) {
  const userId = await useAuthenticated(h3);
  const user = await first(
    drizzle.select().from(users).where(eq(users.id, userId))
  );
  if (!user) throw createError({ statusCode: 500 });

  if (!(user.permissionLevel >= 900)) throw createError({ statusCode: 403 });

  return user;
}

export async function useAuthenticated(h3: H3Event) {
  const userId = await useSoftAuthenticated(h3);
  if (!userId) throw createError({ statusCode: 403 });
  return userId;
}

export async function useSoftAuthenticated(h3: H3Event) {
  const session = await useSession<JournalSession>(h3, GLOBAL_SESSION_CONFIG);
  const userId = session.data.userId;

  return userId;
}

export async function usePermissionLevel(
  h3: H3Event,
  drizzle: ReturnType<typeof useDrizzle>
) {
  const userId = await useSoftAuthenticated(h3);

  // -1 means we're not logged in
  let permissionLevel = -1;
  if (userId) {
    const user = await first(
      drizzle.select().from(users).where(eq(users.id, userId))
    );

    if (!user) throw createError({ statusCode: 500 });

    permissionLevel = user?.permissionLevel;
  }
  return permissionLevel;
}
