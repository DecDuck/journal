import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  displayName: text("displayName").notNull(),
  email: text("email").notNull().unique(),
  avatar: text("avatar").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  permissionLevel: integer("permission").notNull().default(0),
});

export const userSigninMethods = sqliteTable(
  "signinMethods",
  {
    userId: text("id")
      .notNull()
      .references(() => user.id),
    method: text("method").notNull(), // SignMethod enum
    data: text("data").notNull(), // JSON data
  },
  (table) => [primaryKey({ columns: [table.userId, table.method] })]
);

export const category = sqliteTable("category", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  readPermission: integer("read").notNull().default(-1), // By default, publicly accessible
  writePermission: integer("write").notNull().default(0), // By default, requires logged in to write (enforced anyways)
  repository: text("repository"),
});

export const topic = sqliteTable("topic", {
  id: text("id").primaryKey(),
  categoryId: text("categoryId")
    .notNull()
    .references(() => category.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
});

export const tag = sqliteTable("tag", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});

export const post = sqliteTable("post", {
  id: text("id").primaryKey(),
  topicId: text("topicId")
    .notNull()
    .references(() => topic.id, { onDelete: "cascade" }),
  categoryId: text("categoryId")
    .notNull()
    .references(() => category.id, { onDelete: "cascade" }),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  authorId: text("authorId")
    .notNull()
    .references(() => user.id),
  title: text("title").notNull(),
  content: text("content").notNull(), // Markdown formatted
  tags: text("tags").notNull(), // comma-separated array of tag IDs
  attachments: text("attachments").notNull(), // comma-separated array of object IDs
});

export const reply = sqliteTable("reply", {
  id: text("id").primaryKey(),
  postId: text("postId")
    .notNull()
    .references(() => post.id, { onDelete: "cascade" }),
  content: text("content").notNull(), // markdown formatted
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  attachments: text("attachments").notNull(), // comma-separated array of object IDs
});
