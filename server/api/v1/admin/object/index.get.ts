export default defineEventHandler(async (h3) => {
  const drizzle = useDrizzle();
  const _user = await useAdminAuthenticated(h3, drizzle);

  const blob = hubBlob();

  const blobs = [];
  let cursor = undefined;

  do {
    const res = await blob.list({ cursor });
    blobs.push(...res.blobs);
    cursor = res.cursor;
  } while (cursor);

  return blobs;
});
