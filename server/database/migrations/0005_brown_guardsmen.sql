PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_category` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`read` integer DEFAULT -1 NOT NULL,
	`write` integer DEFAULT 0 NOT NULL,
	`repository` text
);
--> statement-breakpoint
INSERT INTO `__new_category`("id", "name", "description", "read", "write", "repository") SELECT "id", "name", "description", "read", "write", "repository" FROM `category`;--> statement-breakpoint
DROP TABLE `category`;--> statement-breakpoint
ALTER TABLE `__new_category` RENAME TO `category`;--> statement-breakpoint
PRAGMA foreign_keys=ON;