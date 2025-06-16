CREATE TABLE `signinMethods` (
	`id` text NOT NULL,
	`method` text NOT NULL,
	`data` text NOT NULL,
	PRIMARY KEY(`id`, `method`),
	FOREIGN KEY (`id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
