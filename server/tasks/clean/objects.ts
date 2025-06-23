import { post, user } from "~~/server/database/schema";

export default defineTask({
  meta: {
    name: "clean:objects",
    description: "Cleanup unreferenced objects.",
  },
  async run() {
    const drizzle = useDrizzle();
    const blob = hubBlob();

    const attachments = (
      await drizzle.select({ attachments: post.attachments }).from(post)
    )
      .filter((e) => e.attachments)
      .map((e) => e.attachments!.split(","))
      .flat();

    const avatars = (
      await drizzle.select({ avatar: user.avatar }).from(user)
    ).map((e) => e.avatar);

    const unreferencedObjects = [];

    let hasMore = false;
    let cursor;
    do {
      const result = await blob.list({ cursor });
      cursor = result.cursor;
      hasMore = result.hasMore;

      for (const object of result.blobs) {
        if (attachments.find((e) => e == object.pathname)) continue;
        if (avatars.find((e) => e == object.pathname)) continue;
        unreferencedObjects.push(object.pathname);
      }
    } while (hasMore);

    console.log(`Deleting: ${unreferencedObjects.length}`);
    await blob.del(unreferencedObjects);

    return { result: true, deleted: unreferencedObjects.length };
  },
});
