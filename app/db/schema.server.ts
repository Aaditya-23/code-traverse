import {
  pgTable,
  text,
  uuid,
  timestamp,
  boolean,
  integer,
} from 'drizzle-orm/pg-core'

import type { InferModel } from 'drizzle-orm'

import { relations } from 'drizzle-orm'

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
})

export const tests = pgTable('tests', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  summary: text('summary').notNull(),
  questionsToAttempt: integer('questions').notNull(),
  imageUrl: text('imageUrl').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
})

export const questions = pgTable('questions', {
  id: uuid('id').defaultRandom().primaryKey(),
  question: text('question').notNull(),
  options: text('options').array().notNull(),
  answer: text('answer').array().notNull(),
  testId: uuid('testId')
    .references(() => tests.id)
    .notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
})

export const userTests = pgTable('userTests', {
  id: uuid('id').defaultRandom().primaryKey(),
  score: integer('score').default(0),
  testCompleted: boolean('testCompleted').default(false).notNull(),
  testId: uuid('testId')
    .references(() => tests.id)
    .notNull(),
  userId: uuid('userId')
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
})

export const responses = pgTable('responses', {
  id: uuid('id').defaultRandom().primaryKey(),
  userResponse: text('userResponse').array().notNull(),
  isCorrect: boolean('isCorrect'),
  userTestId: uuid('userTestId')
    .references(() => userTests.id)
    .notNull(),
  questionId: uuid('questionId')
    .references(() => questions.id)
    .notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
})

export const usersRelations = relations(users, ({ one, many }) => ({
  testsTaken: many(userTests),
}))

export const testsRelations = relations(tests, ({ one, many }) => ({
  testQuestions: many(questions),
  tests: many(userTests),
}))

export const questionsRelations = relations(questions, ({ one, many }) => ({
  test: one(tests, {
    fields: [questions.testId],
    references: [tests.id],
  }),
  responses: many(responses),
}))

export const userTestsRelations = relations(userTests, ({ one, many }) => ({
  user: one(users, {
    fields: [userTests.userId],
    references: [users.id],
  }),
  test: one(tests, {
    fields: [userTests.testId],
    references: [tests.id],
  }),
  responses: many(responses),
}))

export const responsesRelations = relations(responses, ({ one, many }) => ({
  userTest: one(userTests, {
    fields: [responses.userTestId],
    references: [userTests.id],
  }),
  question: one(questions, {
    fields: [responses.questionId],
    references: [questions.id],
  }),
}))

export type User = InferModel<typeof users>
export type Test = InferModel<typeof tests>
export type Question = InferModel<typeof questions>
export type UserTest = InferModel<typeof userTests>
export type Response = InferModel<typeof responses>
