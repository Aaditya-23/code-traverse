ALTER TABLE "questions" ALTER COLUMN "createdAt" SET NOT NULL;
ALTER TABLE "responses" ALTER COLUMN "createdAt" SET NOT NULL;
ALTER TABLE "tests" ALTER COLUMN "createdAt" SET NOT NULL;
ALTER TABLE "userTests" ALTER COLUMN "createdAt" SET NOT NULL;
ALTER TABLE "users" ALTER COLUMN "createdAt" SET NOT NULL;