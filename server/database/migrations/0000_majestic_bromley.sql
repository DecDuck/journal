CREATE TABLE `category` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`read` integer DEFAULT -1 NOT NULL,
	`write` integer DEFAULT 0 NOT NULL,
	`repository` text
);
--> statement-breakpoint
CREATE TABLE `post` (
	`id` text PRIMARY KEY NOT NULL,
	`topicId` text NOT NULL,
	`categoryId` text NOT NULL,
	`createdAt` integer NOT NULL,
	`authorId` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`tags` text NOT NULL,
	`attachments` text NOT NULL,
	FOREIGN KEY (`topicId`) REFERENCES `topic`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`authorId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `reply` (
	`id` text PRIMARY KEY NOT NULL,
	`postId` text NOT NULL,
	`content` text NOT NULL,
	`createdAt` integer NOT NULL,
	`attachments` text NOT NULL,
	FOREIGN KEY (`postId`) REFERENCES `post`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tag` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `topic` (
	`id` text PRIMARY KEY NOT NULL,
	`categoryId` text NOT NULL,
	`name` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`displayName` text NOT NULL,
	`email` text NOT NULL,
	`avatar` text NOT NULL,
	`created_at` integer NOT NULL,
	`permission` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `signinMethods` (
	`id` text NOT NULL,
	`method` text NOT NULL,
	`data` text NOT NULL,
	PRIMARY KEY(`id`, `method`),
	FOREIGN KEY (`id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
