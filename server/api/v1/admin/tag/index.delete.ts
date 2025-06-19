import { type } from "arktype";
import { like } from "drizzle-orm";
import { readJournalValidatedBody, throwingArktype } from "~~/server/validation";
import { post, tag } from "~~/server/database/schema";
import { useAdminAuthenticated } from "~~/server/utils/session";

export const DeleteTag = type({
  id: "string",
}).configure(throwingArktype);

export default defineEventHandler(async (h3) => {
  const body = await readJournalValidatedBody(h3, DeleteTag);

  const drizzle = useDrizzle();
  const _user = await useAdminAuthenticated(h3, drizzle);

  const deletedTag = await first(
    drizzle.delete(tag).where(eq(tag.id, body.id)).returning()
  );
  if (!deletedTag)
    throw createError({ statusCode: 404, statusMessage: "Tag not found" });

  // Remove this tag from all posts that reference it
  // I hate SQLite, for the record
  const postsToUpdate = await drizzle
    .select()
    .from(post)
    .where(like(post.tags, `%${deletedTag.id}%`));

  for (const postToUpdate of postsToUpdate) {
    const tags = postToUpdate.tags.split(",");
    const newTags = tags.filter((e) => e !== deletedTag.id);
    const newTagsString = newTags.join(",");

    await drizzle
      .update(post)
      .set({ tags: newTagsString })
      .where(eq(post.id, postToUpdate.id));
  }

  setResponseStatus(h3, 201);
  return;
});
