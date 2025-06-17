import { lte } from "drizzle-orm";
import { category } from "~~/server/database/schema";
import { usePermissionLevel } from "~~/server/utils/session";

export default defineEventHandler(async (h3) => {
  const drizzle = useDrizzle();

  const permissionLevel = await usePermissionLevel(h3, drizzle);

  const categories = await drizzle
    .select()
    .from(category)
    .where(lte(category.readPermission, permissionLevel));

  return categories;
});
