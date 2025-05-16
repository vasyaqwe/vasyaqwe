CREATE TABLE `entry` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `entry_content_idx` ON `entry` (`content`);