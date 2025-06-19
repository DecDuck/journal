import { adminKeys } from "~~/server/database/schema";
import type { AdminKey } from "~~/server/utils/adminKeys";

export default defineEventHandler(async (h3) => {
  const drizzle = useDrizzle();
  await useAdminAuthenticated(h3, drizzle);

  const keys = (
    await drizzle.select({ key: adminKeys.key }).from(adminKeys)
  ).map((e) => e.key);

  const keyObject = Object.fromEntries(
    await Promise.all(
      keys.map(async (e) => [e, await getAdminKey(e as AdminKey)])
    )
  );

  return keyObject;
});
