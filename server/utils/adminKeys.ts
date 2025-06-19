import { adminKeys } from "../database/schema";

export type AdminKeyTypes = {
  about: string;
  privacyPolicy: string;
  codeOfConduct: string;
};

export type AdminKey = keyof AdminKeyTypes;

export type AdminKeyValue<T extends AdminKey> = AdminKeyTypes[T];

export async function setAdminKey<T extends AdminKey>(
  key: T,
  value: AdminKeyValue<T>
) {
  const drizzle = useDrizzle();

  const data = {
    key,
    value,
    type: typeof value,
    lastUpdated: new Date(),
  } satisfies typeof adminKeys.$inferInsert;

  await drizzle
    .insert(adminKeys)
    .values(data)
    .onConflictDoUpdate({ target: adminKeys.key, set: data });
}

export async function getAdminKey<T extends AdminKey>(key: T) {
  const drizzle = useDrizzle();

  const data = await first(
    drizzle.select().from(adminKeys).where(eq(adminKeys.key, key))
  );

  if (!data) return undefined;

  switch (data.type) {
    case "string":
    default:
      return (data.value as Buffer).toString() as AdminKeyValue<T>;
  }
}
