export default defineEventHandler(async (h3) => {
  const drizzle = useDrizzle();
  const _user = await useAdminAuthenticated(h3, drizzle);

  const blob = hubBlob();

  let blobs = 0;
  let cursor = undefined;

  do {
    const res = await blob.list({ cursor });
    blobs = +res.blobs.length;
    cursor = res.cursor;
  } while (cursor);

  return blobs;
});
