CREATE TABLE `training_plan_day` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`plan_id` integer NOT NULL,
	`week` integer NOT NULL,
	`day_of_week` integer NOT NULL,
	`day_of_plan` integer NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`min_miles` real DEFAULT 0 NOT NULL,
	`max_miles` real DEFAULT 0 NOT NULL,
	FOREIGN KEY (`plan_id`) REFERENCES `training_plan`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `training_plan` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`length_weeks` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
