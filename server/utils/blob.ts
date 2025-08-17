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
  const mapped = await Promise.all(
    attachments
      .filter((e) => e) // If we split on "", we get [""]
      .map(async (e) => {
        const metadata = await headBlob(blob, e);
        if (!metadata) return undefined;
        return {
          filename: metadata.customMetadata.filename!,
          size: metadata.size,
          type: metadata.contentType ?? "unknown",
          downloadId: e,
        };
      })
  );
  return mapped.filter((e) => e !== undefined);
}
