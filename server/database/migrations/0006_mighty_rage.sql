PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_adminKeys` (
	`key` text PRIMARY KEY NOT NULL,
	`value` blob,
	`lastUpdated` integer DEFAULT '"2025-06-19T05:04:08.530Z"' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_adminKeys`("key", "value", "lastUpdated") SELECT "key", "value", "lastUpdated" FROM `adminKeys`;--> statement-breakpoint
DROP TABLE `adminKeys`;--> statement-breakpoint
ALTER TABLE `__new_adminKeys` RENAME TO `adminKeys`;--> statement-breakpoint
PRAGMA foreign_keys=ON;