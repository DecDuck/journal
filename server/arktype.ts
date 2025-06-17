// Another banger shamelessly stolen from the Drop OSS project
// Thanks again guys

import type { BlobObject } from "@nuxthub/core";
import { ArkErrors } from "arktype";
import { configure } from "arktype/config";
import type { H3Event } from "h3";

export const throwingArktype = configure({
  onFail: (errors) => errors.throw(),
  actual: () => "",
});

// be sure to specify both the runtime and static configs

declare global {
  interface ArkEnv {
    onFail: typeof throwingArktype.onFail;
  }
}

export async function readJournalValidatedBody<T>(
  event: H3Event,
  validate: (data: object) => T
): Promise<T> {
  const body = await readBody(event);
  try {
    // Delete all values that are 'null'
    if (typeof body === "object" && !Array.isArray(body) && body !== null) {
      for (const [key, value] of Object.entries(body) as Array<
        [string, unknown]
      >) {
        if (value === null) {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete body[key];
        }
      }
    }
    return validate(body);
  } catch (e) {
    if (e instanceof ArkErrors) {
      throw createError({
        statusCode: 400,
        statusMessage: e.summary,
      });
    }
    throw createError({
      statusCode: 400,
      statusMessage: e instanceof Error ? e.message : `${e}`,
    });
  }
}

export async function readJournalValidatedMultipart<T>(
  event: H3Event,
  validate: (data: object) => T,
  permissions = "anonymous:read"
) {
  const body = await readMultipartFormData(event);
  if (!body)
    throw createError({
      statusCode: 400,
      statusMessage: "Multi-part required for this endpoint",
    });

  const delayedParts: Array<(typeof body)[0]> = [];
  const files: { [key: string]: Array<BlobObject> } = {};
  const objectBody: { [key: string]: unknown } = {};

  const blob = hubBlob();

  for (const part of body) {
    if (!part.name) continue;
    if (part.filename) {
      delayedParts.push(part);

      objectBody[part.name] = [];
      continue;
    }

    try {
      const data = JSON.parse(part.data.toString());
      objectBody[part.name] = data;
    } catch {
      throw createError({
        statusCode: 400,
        statusMessage: "Data must be string-encoded JSON objects.",
      });
    }
  }

  // Validate before bothering to upload everything
  let validBody;
  try {
    validBody = validate(objectBody);
  } catch (e) {
    if (e instanceof ArkErrors) {
      throw createError({
        statusCode: 400,
        statusMessage: e.summary,
      });
    }
    throw createError({
      statusCode: 400,
      statusMessage: e instanceof Error ? e.message : `${e}`,
    });
  }

  for (const part of delayedParts) {
    if (!part.filename || !part.name)
      throw createError({ statusCode: 500, statusMessage: "..." });
    // This is a file, and we should upload it.
    const data = new Blob([part.data as unknown as ArrayBuffer]);
    const obj = await blob.put(part.filename, data, {
      addRandomSuffix: true,
      prefix: "user-uploads",
      customMetadata: {
        filename: part.filename,
        permissions,
      },
    });

    files[part.name] ??= [];
    files[part.name].push(obj);
  }

  return { body: validBody, files };
}
