export default defineEventHandler(async () => {
  const about = await getAdminKey("about");

  return about;
});
