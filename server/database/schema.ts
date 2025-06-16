import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  displayName: text("displayName").notNull(),
  email: text("email").notNull().unique(),
  avatar: text("avatar").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const userSigninMethods = sqliteTable(
  "signinMethods",
  {
    userId: text("id")
      .notNull()
      .references(() => users.id),
    method: text("method").notNull(), // SignMethod enum
    data: text("data").notNull(), // JSON data
  },
  (table) => [primaryKey({ columns: [table.userId, table.method] })]
);
