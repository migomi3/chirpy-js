ALTER TABLE "refresh_tokens" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '60 DAYS';--> statement-breakpoint
ALTER TABLE "refresh_tokens" ALTER COLUMN "expires_at" SET NOT NULL;