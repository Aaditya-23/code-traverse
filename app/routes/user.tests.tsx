import { redirect, type LoaderArgs, json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { eq } from 'drizzle-orm'
import { db } from '~/db/drizzle.server'
import { userTests, users } from '~/db/schema.server'
import { Navbar } from '~/layouts'
import { authenticator } from '~/services/auth.server'

export async function loader({ request }: LoaderArgs) {
  const authenticatedUser = await authenticator.isAuthenticated(request)

  if (!authenticatedUser) return redirect('/auth')

  const user = await db.query.users.findFirst({
    where: eq(users.email, authenticatedUser.email),
  })

  if (!user) return authenticator.logout(request, { redirectTo: '/auth' })

  const tests = await db.query.userTests.findMany({
    where: eq(userTests.userId, user.id),
    columns: {
      id: true,
      score: true,
      testCompleted: true,
    },

    with: {
      test: {
        columns: {
          name: true,
          questionsToAttempt: true,
        },
      },
    },
  })

  return json({ user, tests })
}

export default function UserTests() {
  const { user, tests } = useLoaderData<typeof loader>()

  return (
    <>
      <Navbar user={user} />
      <main className='space-y-8 p-2'>
        <h1 className='text-2xl font-semibold uppercase'>tests taken</h1>

        <div className='flex flex-col gap-4'>
          {tests.map((test, index) => {
            const {
              score,
              id,
              test: { name, questionsToAttempt },
              testCompleted,
            } = test

            return (
              <div
                key={index}
                className='flex flex-col gap-4 rounded-md p-2 shadow-md outline outline-black/10'
              >
                <div className='text-xl font-medium capitalize'>{name}</div>
                <div className='text-sm text-gray-400'>
                  {questionsToAttempt} questions
                </div>

                {testCompleted && (
                  <div className='capitalize'> you scored {score}</div>
                )}

                {testCompleted ? (
                  <Link
                    className='w-max rounded-md bg-blue-500 p-2 text-sm font-medium uppercase text-white'
                    to={`/test/${id}/results`}
                  >
                    check results
                  </Link>
                ) : (
                  <Link
                    className='w-max rounded-md bg-blue-500 p-2 text-sm font-medium uppercase text-white'
                    to={`/test/${id}`}
                  >
                    complete this test
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      </main>
    </>
  )
}
