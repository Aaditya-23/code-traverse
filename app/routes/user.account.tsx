import {
  type LoaderArgs,
  json,
  redirect,
  type ActionArgs,
} from '@remix-run/node'
import { useLoaderData, useNavigation, useSubmit } from '@remix-run/react'
import { eq, sql } from 'drizzle-orm'
import { Button } from '~/components'
import { db } from '~/db/drizzle.server'
import { userTests, users } from '~/db/schema.server'
import { Navbar } from '~/layouts'
import { verifyUser } from '~/server/user.server'
import { authenticator } from '~/services/auth.server'

export async function loader({ request }: LoaderArgs) {
  const authenticatedUser = await authenticator.isAuthenticated(request)

  if (!authenticatedUser) return redirect('/auth')

  const user = (await db.select().from(users))[0]

  if (!user) return authenticator.logout(request, { redirectTo: '/auth' })

  return json({ user })
}

export default function Account() {
  const { user } = useLoaderData<typeof loader>()
  const { state } = useNavigation()
  const submit = useSubmit()

  function handleDeleteAccount() {
    submit(null, { method: 'post' })
  }

  return (
    <>
      <Navbar user={user} />
      <main className='mx-auto w-max space-y-8 p-2'>
        <h1 className='text-2xl font-semibold uppercase'>account</h1>

        <div className='space-y-4'>
          <p className='text-2xl font-medium uppercase text-red-500'>
            delete my account
          </p>
          <p>
            Deleting your account will delete all the information related to
            your account, including your tests scores. Please be certain.
          </p>
          <Button
            onClick={handleDeleteAccount}
            disabled={state === 'submitting'}
            className='bg-red-600/90 text-sm font-semibold tracking-normal outline-red-500 disabled:bg-red-400'
          >
            delete my account
          </Button>
        </div>
      </main>
    </>
  )
}

export async function action({ request }: ActionArgs) {
  const userOrRedirect = await verifyUser(request)

  if (!('id' in userOrRedirect)) return userOrRedirect

  const { id } = userOrRedirect

  await db.execute(
    sql.raw(
      `DELETE FROM responses WHERE "userTestId" IN (SELECT ut.id FROM "users" JOIN "userTests" AS ut ON users.id = ut."userId" WHERE users.id = '${id}')`
    )
  )

  await db.delete(userTests).where(eq(userTests.userId, id))
  await db.delete(users).where(eq(users.id, id))

  return authenticator.logout(request, { redirectTo: '/auth' })
}
