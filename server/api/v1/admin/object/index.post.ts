export default defineEventHandler(async (h3) => {
  const drizzle = useDrizzle();
  const _user = await useAdminAuthenticated(h3, drizzle);

  const result = await runTask("clean:objects");

  if (!result.result) {
    throw createError({
      statusCode: 500,
      statusMessage: "Cleanup failed for unknown reason.s",
    });
  }

  return result;
});
