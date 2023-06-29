ALTER TABLE "tests" ADD COLUMN "isArchived" boolean DEFAULT false NOT NULL;
ALTER TABLE "users" ADD COLUMN "isAdmin" boolean DEFAULT false NOT NULL;