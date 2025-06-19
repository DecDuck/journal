import type { ZodType} from "zod/v4";
import { z } from "zod/v4";
import { arkyZod } from "../validation";
import { $ZodError } from "zod/v4/core";

export function definePaginatedEndpoint<T extends object, V>(
  validator: ZodType<T>,
  pageQuery: (
    drizzle: ReturnType<typeof useDrizzle>,
    options: T,
    permissions: number,
    offset: number,
    count: number
  ) => Promise<{ results: Array<V>; count: number }>
) {
  const paginationValidator = z.object({
    page: z.string().optional(),
    count: z.string().optional(),
  });

  return defineEventHandler(async (h3) => {
    const query = getQuery(h3);

    const optionsQuery = arkyZod(validator.safeParse(query));
    if (optionsQuery instanceof $ZodError)
      throw createError({
        statusCode: 400,
        message: optionsQuery.message,
      });

    const paginationQuery = arkyZod(paginationValidator.safeParse(query));
    if (paginationQuery instanceof $ZodError)
      throw createError({
        statusCode: 400,
        message: paginationQuery.message,
      });

    const pageSize = parseInt(paginationQuery.count ?? "10");
    const offset = parseInt(paginationQuery.page ?? "0") * pageSize;
    if (Number.isNaN(pageSize) || Number.isNaN(offset))
      throw createError({
        statusCode: 400,
        statusMessage: "count and page must both be numbers",
      });

    const drizzle = useDrizzle();
    const permissions = await usePermissionLevel(h3, drizzle);

    const { results, count } = await pageQuery(
      drizzle,
      optionsQuery as T,
      permissions,
      offset,
      pageSize
    );

    return { results, pages: Math.ceil(count / pageSize) };
  });
}
