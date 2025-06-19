import { AdminForm } from "~~/forms/admin";
import { readJournalValidatedBody, throwingArktype } from "~~/server/arktype";

export default defineEventHandler(async (h3) => {
  const drizzle = useDrizzle();
  await useAdminAuthenticated(h3, drizzle);

  const data = await readJournalValidatedBody(
    h3,
    AdminForm.validator.configure(throwingArktype)
  );

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) continue;
    // We're admin, so it's safe to just pass these directly into the database
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    await setAdminKey(key, value);
  }

  return;
});
