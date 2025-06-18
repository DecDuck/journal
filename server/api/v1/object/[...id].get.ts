import type { JournalSession } from "#imports";
import { headBlob } from "~~/server/utils/blob";

export default defineEventHandler(async (h3) => {
  const id = getRouterParam(h3, "id");
  if (!id) throw createError({ statusCode: 400, statusMessage: "No ID" });

  const blob = hubBlob();

  const head = await headBlob(blob, id);
  if (!head) throw createError({ statusCode: 404 });

  const permissions = head.customMetadata.permissions.split(",") || [];

  const session = await useSession<JournalSession>(h3, GLOBAL_SESSION_CONFIG);
  const userId = session.data.userId;

  const validACLs = ["anonymous:read", `${userId}:read`];

  if (permissions.filter((e) => validACLs.includes(e)).length == 0)
    throw createError({ statusCode: 404 });

  setHeader(h3, "Content-Security-Policy", "default-src 'none';");

  const filename = head.customMetadata.filename;
  if(head.pathname.startsWith("user-uploads") && filename){
    setHeader(h3, "Content-Disposition", `attachment; ${filename}`)
  }

  return await blob.serve(h3, id);
});
