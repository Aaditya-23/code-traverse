CREATE TABLE IF NOT EXISTS "questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question" text NOT NULL,
	"options" text[] NOT NULL,
	"answer" text[] NOT NULL,
	"testId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userResponse" text[] NOT NULL,
	"isCorrect" boolean,
	"userTestId" uuid NOT NULL,
	"questionId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "tests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"summary" text NOT NULL,
	"questions" integer NOT NULL,
	"imageUrl" text NOT NULL,
	"createdAt" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "userTests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"score" integer DEFAULT 0,
	"testCompleted" boolean DEFAULT false NOT NULL,
	"testId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"createdAt" timestamp DEFAULT now()
);

DO $$ BEGIN
 ALTER TABLE "questions" ADD CONSTRAINT "questions_testId_tests_id_fk" FOREIGN KEY ("testId") REFERENCES "tests"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "responses" ADD CONSTRAINT "responses_userTestId_userTests_id_fk" FOREIGN KEY ("userTestId") REFERENCES "userTests"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "responses" ADD CONSTRAINT "responses_questionId_questions_id_fk" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "userTests" ADD CONSTRAINT "userTests_testId_tests_id_fk" FOREIGN KEY ("testId") REFERENCES "tests"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "userTests" ADD CONSTRAINT "userTests_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
