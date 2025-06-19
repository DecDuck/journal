// Another banger shamelessly stolen from the Drop OSS project
// Thanks again guys

import type { BlobObject } from "@nuxthub/core";
import type { H3Event } from "h3";
import type { ZodSafeParseResult, ZodType } from "zod/v4";

export async function readJournalValidatedBody<T>(
  event: H3Event,
  validate: ZodType<T>
): Promise<T> {
  const body = await readBody(event);
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
  return throwyZod(validate.safeParse(body));
}

export async function readJournalValidatedMultipart<T>(
  event: H3Event,
  validate: ZodType<T>,
  permissions = "anonymous:read"
) {
  const body = await readMultipartFormData(event);
  if (!body)
    throw createError({
      statusCode: 400,
      statusMessage: "Multi-part required for this endpoint",
    });

  const delayedParts: Array<(typeof body)[0]> = [];
  const files: { [key: string]: Array<BlobObject> | undefined } = {};
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
        statusMessage: `Data must be string-encoded JSON objects. (${part.name})`,
      });
    }
  }

  // Validate before bothering to upload everything
  const validBody = throwyZod(validate.safeParse(objectBody));

  for (const part of delayedParts) {
    if (!part.filename || !part.name)
      throw createError({ statusCode: 500, statusMessage: "..." });
    // This is a file, and we should upload it.
    const data = new Blob([part.data as unknown as ArrayBuffer]);
    const obj = await blob.put(randomUUID(40), data, {
      prefix: "user-uploads",
      customMetadata: {
        filename: part.filename,
        permissions,
      },
    });

    files[part.name] ??= [];
    files[part.name]!.push(obj);
  }

  return { body: validBody, files };
}

export function arkyZod<T>(input: ZodSafeParseResult<T>) {
  return (input.data ?? input.error)!;
}

export function throwyZod<T>(input: ZodSafeParseResult<T>) {
  if (input.data) {
    return input.data;
  }

  throw createError({
    statusCode: 400,
    message: input.error?.message ?? "Invalid form.",
  });
}
