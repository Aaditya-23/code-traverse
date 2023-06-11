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
import { userExists } from '~/server/user.server'
import { authenticator } from '~/services/auth.server'

export async function loader({ request }: LoaderArgs) {
  const authenticatedUser = await authenticator.isAuthenticated(request)
  let user = null

  try {
    if (authenticatedUser)
      user =
        (
          await db
            .select({
              id: users.id,
              email: users.email,
              name: users.name,
            })
            .from(users)
            .where(eq(users.id, authenticatedUser.id))
        )[0] ?? null
  } catch (error) {
    if (authenticatedUser)
      await authenticator.logout(request, {
        redirectTo: '/auth',
      })
  }

  const allTests = await db
    .select({
      id: tests.id,
      name: tests.name,
      summary: tests.summary,
      imageUrl: tests.imageUrl,
    })
    .from(tests)

  return json({ user, tests: allTests })
}

export default function Home() {
  const { user, tests } = useLoaderData<typeof loader>()

  return (
    <>
      <Navbar user={user} />
      <main className='flex flex-col flex-wrap gap-4 p-2 md:flex-row'>
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

  try {
    invariant(testId && typeof testId === 'string')
    const test = await db
      .select({ id: tests.id })
      .from(tests)
      .where(eq(tests.id, testId))

    if (test[0] === undefined) throw new Error()
  } catch (error) {
    return json({ error: 'invalid test id' })
  }

  const authenticatedUser = await authenticator.isAuthenticated(request)

  if (authenticatedUser) {
    const res = await userExists(authenticatedUser.email)
    if (!res) return authenticator.logout(request, { redirectTo: '/auth' })
    return createTest({ testId, userId: authenticatedUser.id })
  }

  return redirect('/auth')
}
