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

export const tag = sqliteTable("tag", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});

export const post = sqliteTable("table", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(), // Markdown formatted
  tags: text("tags").notNull(), // comma-separated array of tag IDs
  attachments: text("attachments").notNull(), // comma-separated array of object IDs
});

export const reply = sqliteTable("reply", {
  id: text("id").primaryKey(),
  postId: text("postId")
    .notNull()
    .references(() => post.id),
  content: text("content").notNull(),
  attachments: text("attachments").notNull(), // comma-separated array of object IDs
});