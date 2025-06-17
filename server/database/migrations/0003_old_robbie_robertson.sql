CREATE TABLE `category` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `table` (
	`id` text PRIMARY KEY NOT NULL,
	`topicID` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`tags` text NOT NULL,
	`attachments` text NOT NULL,
	FOREIGN KEY (`topicID`) REFERENCES `topic`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `reply` (
	`id` text PRIMARY KEY NOT NULL,
	`postId` text NOT NULL,
	`content` text NOT NULL,
	`attachments` text NOT NULL,
	FOREIGN KEY (`postId`) REFERENCES `table`(`id`) ON UPDATE no action ON DELETE no action
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
	`name` text,
	FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `users` ADD `permission` integer DEFAULT 0 NOT NULL;