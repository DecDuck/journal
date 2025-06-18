import type { Type } from "arktype";
import { ArkErrors, type } from "arktype";

export function definePaginatedEndpoint<T extends object, V>(
  validator: Type<T>,
  pageQuery: (
    drizzle: ReturnType<typeof useDrizzle>,
    options: T,
    permissions: number,
    offset: number,
    count: number
  ) => Promise<{ results: Array<V>; count: number }>
) {
  const paginationValidator = type({
    page: "string?",
    count: "string?",
  });

  return defineEventHandler(async (h3) => {
    const query = getQuery(h3);

    const optionsQuery = validator(query);

    const paginationQuery = paginationValidator(query);
    if (paginationQuery instanceof ArkErrors)
      throw createError({
        statusCode: 400,
        statusMessage: paginationQuery.summary,
      });

    const pageSize = parseInt(paginationQuery.count ?? "0");
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
