import { json, type LoaderArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { and, eq } from 'drizzle-orm'
import { db } from '~/db/drizzle.server'
import { users, userTests } from '~/db/schema.server'
import { verifyUser } from '~/server/user.server'
import NotFound from './notFound'
import IncompleteTest from './incompleteTest'
import UserResponse from './userResponse'
import { Navbar } from '~/layouts'

export async function loader({ request, params }: LoaderArgs) {
  const { id } = params

  const userOrRedirect = await verifyUser(request)
  if (!('id' in userOrRedirect)) return userOrRedirect

  const user = (
    await db.select().from(users).where(eq(users.id, userOrRedirect.id))
  )[0]

  try {
    const { isTestCompleted } = (
      await db
        .select({ isTestCompleted: userTests.testCompleted })
        .from(userTests)
        .where(eq(userTests.id, id || ''))
    )[0]

    if (!isTestCompleted) return json({ user, incompleteTest: true })

    const test = await db.query.userTests.findFirst({
      where: and(eq(userTests.id, id || ''), eq(userTests.userId, user.id)),
      columns: {
        score: true,
      },
      with: {
        test: {
          columns: {
            name: true,
            questionsToAttempt: true,
          },
        },
        responses: {
          with: {
            question: {
              columns: {
                question: true,
                answer: true,
                options: true,
              },
            },
          },
          columns: {
            isCorrect: true,
            id: true,
            userResponse: true,
          },
        },
      },
    })

    if (!test) throw new Error('test not found')

    return json({ user, test })
  } catch (error) {
    return json({ user, notFound: true })
  }
}

export default function Result() {
  const data = useLoaderData<typeof loader>()

  if ('notFound' in data) return <NotFound />
  else if ('incompleteTest' in data) return <IncompleteTest />

  const {
    user,
    test: { responses, score, test },
  } = data

  return (
    <>
      <Navbar user={user} />
      <main className='space-y-8 p-2'>
        <h1 className='text-2xl font-semibold uppercase'>{test.name}</h1>

        <p className='text- capitalize'>
          you scored {score} out of {test.questionsToAttempt}
        </p>

        <div className='flex flex-col gap-5'>
          {responses.map((response, index) => (
            <UserResponse
              key={index}
              answers={response.question.answer}
              options={response.question.options}
              question={response.question.question}
              userResponse={response.userResponse}
            />
          ))}
        </div>
      </main>
    </>
  )
}
