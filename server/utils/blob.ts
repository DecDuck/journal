import { H3Error } from "h3";

export async function headBlob(
  blob: ReturnType<typeof hubBlob>,
  pathname: string
) {
  try {
    return await blob.head(pathname);
  } catch (e) {
    if (e instanceof H3Error) {
      if (e.statusCode == 404) {
        return undefined;
      }
    }
    console.log(e);
    throw e;
  }
}

export async function mapAttachments(attachments: string[]) {
  const blob = hubBlob();
  return await Promise.all(
    attachments
      .filter((e) => e) // If we split on "", we get [""]
      .map(async (e) => {
        const metadata = await headBlob(blob, e);
        if (!metadata)
          throw createError({
            statusCode: 500,
            statusMessage: "Attachment added but does not exist: " + e,
          });
        return {
          filename: metadata.customMetadata.filename!,
          size: metadata.size,
          type: metadata.contentType ?? "unknown",
          downloadId: e,
        };
      })
  );
}
