ALTER TABLE `table` RENAME TO `post`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_post` (
	`id` text PRIMARY KEY NOT NULL,
	`topicId` text NOT NULL,
	`categoryId` text NOT NULL,
	`createdAt` integer NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`tags` text NOT NULL,
	`attachments` text NOT NULL,
	FOREIGN KEY (`topicId`) REFERENCES `topic`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_post`("id", "topicId", "categoryId", "createdAt", "title", "content", "tags", "attachments") SELECT "id", "topicId", "categoryId", "createdAt", "title", "content", "tags", "attachments" FROM `post`;--> statement-breakpoint
DROP TABLE `post`;--> statement-breakpoint
ALTER TABLE `__new_post` RENAME TO `post`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_reply` (
	`id` text PRIMARY KEY NOT NULL,
	`postId` text NOT NULL,
	`content` text NOT NULL,
	`attachments` text NOT NULL,
	FOREIGN KEY (`postId`) REFERENCES `post`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_reply`("id", "postId", "content", "attachments") SELECT "id", "postId", "content", "attachments" FROM `reply`;--> statement-breakpoint
DROP TABLE `reply`;--> statement-breakpoint
ALTER TABLE `__new_reply` RENAME TO `reply`;