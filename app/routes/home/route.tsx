import { type ActionArgs, type LoaderArgs, redirect } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { eq } from 'drizzle-orm'
import invariant from 'tiny-invariant'
import { TestCard } from '~/components'
import { db } from '~/db/drizzle.server'
import { tests, users } from '~/db/schema.server'
import { Navbar } from '~/layouts'
import { createTest } from '~/server/test.server'
import { userExistsInDb } from '~/server/user.server'
import { authenticator } from '~/services/auth.server'

export async function loader({ request }: LoaderArgs) {
  const allTests = await db.query.tests.findMany({
    columns: {
      createdAt: false,
    },
  })

  const userFromSession = await authenticator.isAuthenticated(request)
  if (!userFromSession) return json({ user: null, tests: allTests })

  const user = await db.query.users.findFirst({
    where: eq(users.id, userFromSession.id),
  })

  if (!user)
    return await authenticator.logout(request, {
      redirectTo: '/auth',
    })

  return json({ user, tests: allTests })
}

export default function Home() {
  const { user, tests } = useLoaderData<typeof loader>()

  return (
    <>
      <Navbar user={user} />
      <main className='flex flex-col flex-wrap gap-4 p-2 sm:flex-row'>
        {tests.map((test, index) => (
          <TestCard test={test} key={index} />
        ))}
      </main>
    </>
  )
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData()
  const testId = formData.get('testId')

  invariant(testId && typeof testId === 'string', 'invalid test id')
  const test = await db.query.tests.findFirst({
    where: eq(tests.id, testId),
    columns: { id: true },
  })

  if (!test) throw new Error('invalid test id')

  const userFromSession = await authenticator.isAuthenticated(request)

  if (userFromSession) {
    const res = await userExistsInDb(userFromSession.id)
    if (!res)
      return await authenticator.logout(request, { redirectTo: '/auth' })

    return createTest({ testId, userId: userFromSession.id })
  }

  return redirect('/auth')
}
