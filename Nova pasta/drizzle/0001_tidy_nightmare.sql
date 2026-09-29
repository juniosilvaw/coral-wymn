CREATE TABLE `customLists` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`type` enum('service','rehearsal','custom') NOT NULL DEFAULT 'custom',
	`scheduledDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `customLists_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `favorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`hymnId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `favorites_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hymnAudios` (
	`id` int AUTO_INCREMENT NOT NULL,
	`hymnId` int NOT NULL,
	`vocalRange` enum('soprano','contralto','tenor','baixo','full') NOT NULL,
	`audioUrl` text NOT NULL,
	`duration` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `hymnAudios_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hymns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`number` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`source` enum('harpa_crista','cantor_cristao','salmos') NOT NULL,
	`lyrics` text NOT NULL,
	`tonality` varchar(50),
	`composer` varchar(255),
	`author` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `hymns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `listItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`listId` int NOT NULL,
	`hymnId` int NOT NULL,
	`order` int NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `listItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`listId` int,
	`title` varchar(255) NOT NULL,
	`message` text,
	`scheduledTime` timestamp NOT NULL,
	`sent` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vocalParts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`hymnId` int NOT NULL,
	`vocalRange` enum('soprano','contralto','tenor','baixo') NOT NULL,
	`lyrics` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vocalParts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `vocalRange` enum('soprano','contralto','tenor','baixo');--> statement-breakpoint
ALTER TABLE `users` ADD `fontSize` int DEFAULT 16 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `theme` enum('light','dark') DEFAULT 'light' NOT NULL;