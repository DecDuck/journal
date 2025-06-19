PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_adminKeys` (
	`key` text PRIMARY KEY NOT NULL,
	`value` blob,
	`type` text DEFAULT 'string' NOT NULL,
	`lastUpdated` integer DEFAULT '"2025-06-19T05:12:59.587Z"' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_adminKeys`("key", "value", "type", "lastUpdated") SELECT "key", "value", "type", "lastUpdated" FROM `adminKeys`;--> statement-breakpoint
DROP TABLE `adminKeys`;--> statement-breakpoint
ALTER TABLE `__new_adminKeys` RENAME TO `adminKeys`;--> statement-breakpoint
PRAGMA foreign_keys=ON;