import { drizzle } from "drizzle-orm/d1";

import * as schema from "../database/schema";
export { sql, eq, and, or } from "drizzle-orm";

export const tables = schema;

export function useDrizzle() {
  return drizzle(hubDatabase(), { schema });
}

export type User = typeof schema.user.$inferSelect;
export type UserSigninMethod = typeof schema.userSigninMethods.$inferSelect;
export type Category = typeof schema.category.$inferSelect;
export type Topic = typeof schema.topic.$inferSelect;
export type Tag = typeof schema.tag.$inferSelect;
export type Post = typeof schema.post.$inferSelect;
export type Reply = typeof schema.reply.$inferSelect;

export async function first<T>(arr: Promise<Array<T>>) {
  return (await arr).at(0);
}
