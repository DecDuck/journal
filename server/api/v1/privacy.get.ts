export default defineEventHandler(async () => {
  const privacyPolicy = await getAdminKey("privacyPolicy");

  return privacyPolicy;
});
