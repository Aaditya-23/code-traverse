import { json, redirect } from '@remix-run/node'
import { and, eq, sql } from 'drizzle-orm'
import { db } from '~/db/drizzle.server'
import { questions, responses, tests, userTests } from '~/db/schema.server'
import { generateRandomNumber } from '~/utils/generateRandomNumber'

export async function createTest({
  testId,
  userId,
}: {
  testId: string
  userId: string
}) {
  const userTest = (
    await db
      .insert(userTests)
      .values({
        testId,
        userId,
      })
      .returning({ id: userTests.id })
  )[0]

  const { questionsToAttempt } = (
    await db
      .select({ questionsToAttempt: tests.questionsToAttempt })
      .from(tests)
      .where(eq(tests.id, testId))
  )[0]

  await registerQuestions({
    userTestId: userTest.id,
    questionsToAttempt,
    testId,
  })

  return redirect(`/test/${userTest.id}`)
}

// !Not to be called directly
async function registerQuestions({
  userTestId,
  questionsToAttempt,
  testId,
}: {
  userTestId: string
  questionsToAttempt: number
  testId: string
}) {
  const questionPool = await db
    .select({ id: questions.id })
    .from(questions)
    .where(eq(questions.testId, testId))

  const poolSize = questionPool.length
  const fakePool = Array(poolSize)
    .fill(null)
    .map((val, index) => index)
  const selectedQuestions: Array<{ id: string }> = []

  for (let i = 0; i < questionsToAttempt; i++) {
    const currPoolSize = fakePool.length

    const index = generateRandomNumber(0, currPoolSize - 1)
    selectedQuestions.push({ id: questionPool[fakePool[index]].id })
    fakePool.splice(index, 1)
  }

  await db.insert(responses).values(
    selectedQuestions.map(({ id }) => ({
      questionId: id,
      userTestId,
      userResponse: [],
    }))
  )
}

export async function submitAnswer({
  answers,
  responseId,
}: {
  answers: Array<string>
  responseId: string
}) {
  const response = await db.query.responses.findFirst({
    columns: {
      isCorrect: true,
    },
    where: eq(responses.id, responseId),
    with: {
      question: {
        columns: {
          answer: true,
        },
      },
    },
  })

  if (!response || typeof response.isCorrect === 'boolean')
    throw new Error('an error occured')

  const correctAnswers = response.question.answer

  const isCorrect =
    correctAnswers.length === answers.length &&
    correctAnswers.reduce((accumulator, val) => {
      if (!accumulator) return false
      return answers.includes(val)
    }, true)

  await db
    .update(responses)
    .set({ isCorrect, userResponse: answers })
    .where(eq(responses.id, responseId))

  return json(null)
}

export async function endTest(userTestId: string, redirectUrl: string) {
  const score = (
    await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(responses)
      .where(
        and(eq(responses.userTestId, userTestId), eq(responses.isCorrect, true))
      )
  )[0]

  await db
    .update(userTests)
    .set({ testCompleted: true, score: score.count })
    .where(eq(userTests.id, userTestId))

  return redirect(redirectUrl)
}
