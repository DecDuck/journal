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
