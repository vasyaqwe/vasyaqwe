CREATE TABLE "entry" (
	"id" text PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE INDEX "entry_content_idx" ON "entry" USING btree ("content");