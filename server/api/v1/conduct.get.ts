export default defineEventHandler(async () => {
  const codeOfConduct = await getAdminKey("codeOfConduct");

  return codeOfConduct;
});
