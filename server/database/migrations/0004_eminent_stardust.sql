ALTER TABLE `category` ADD `read` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `category` ADD `write` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `category` ADD `repository` text;