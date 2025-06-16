// Another banger shamelessly stolen from the Drop OSS project
// Thanks again guys

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
        statusMessage: `Invalid body: ${e.summary}`,
      });
    }
    throw createError({
      statusCode: 400,
      statusMessage: e instanceof Error ? e.message : `${e}`,
    });
  }
}
