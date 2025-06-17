PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_table` (
	`id` text PRIMARY KEY NOT NULL,
	`topicId` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`tags` text NOT NULL,
	`attachments` text NOT NULL,
	FOREIGN KEY (`topicId`) REFERENCES `topic`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_table`("id", "topicId", "title", "content", "tags", "attachments") SELECT "id", "topicId", "title", "content", "tags", "attachments" FROM `table`;--> statement-breakpoint
DROP TABLE `table`;--> statement-breakpoint
ALTER TABLE `__new_table` RENAME TO `table`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_reply` (
	`id` text PRIMARY KEY NOT NULL,
	`postId` text NOT NULL,
	`content` text NOT NULL,
	`attachments` text NOT NULL,
	FOREIGN KEY (`postId`) REFERENCES `table`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_reply`("id", "postId", "content", "attachments") SELECT "id", "postId", "content", "attachments" FROM `reply`;--> statement-breakpoint
DROP TABLE `reply`;--> statement-breakpoint
ALTER TABLE `__new_reply` RENAME TO `reply`;--> statement-breakpoint
CREATE TABLE `__new_topic` (
	`id` text PRIMARY KEY NOT NULL,
	`categoryId` text NOT NULL,
	`name` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_topic`("id", "categoryId", "name", "description") SELECT "id", "categoryId", "name", "description" FROM `topic`;--> statement-breakpoint
DROP TABLE `topic`;--> statement-breakpoint
ALTER TABLE `__new_topic` RENAME TO `topic`;