import {
  type LoaderArgs,
  type ActionArgs,
  json,
  redirect,
} from '@remix-run/node'
import { useEffect } from 'react'
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from '@remix-run/react'
import { eq } from 'drizzle-orm'
import { enqueueSnackbar } from 'notistack'
import { Button, Input } from '~/components'
import { db } from '~/db/drizzle.server'
import { users } from '~/db/schema.server'
import { verifyUser } from '~/server/user.server'
import { authenticator } from '~/services/auth.server'
import { Navbar } from '~/layouts'

export async function loader({ request }: LoaderArgs) {
  const authenticatedUser = await authenticator.isAuthenticated(request)

  if (!authenticatedUser) return redirect('/auth')

  const user = await db.query.users.findFirst({
    where: eq(users.email, authenticatedUser.email),
  })

  if (!user) return authenticator.logout(request, { redirectTo: '/auth' })

  return json({ user })
}

export default function Profile() {
  const {
    user: { name, email, id },
  } = useLoaderData<typeof loader>()

  const actionData = useActionData<typeof action>()

  const { state } = useNavigation()

  useEffect(() => {
    if (!actionData) return

    if ('error' in actionData)
      enqueueSnackbar(actionData.error, {
        variant: 'error',
      })
    else if ('message' in actionData)
      enqueueSnackbar(actionData.message, {
        variant: 'success',
      })
  }, [actionData])

  return (
    <>
      <Navbar user={{ name, email, id }} />
      <main className='mx-auto w-max space-y-8 p-2'>
        <h1 className='text-2xl font-semibold uppercase'>profile</h1>

        <Form method='post' className='flex flex-col gap-4'>
          <label className='flex flex-col gap-3'>
            <span className='w-max capitalize'>full name</span>
            <Input type='text' defaultValue={name} name='name' />
          </label>

          <label className='flex flex-col gap-3'>
            <span className='w-max capitalize'>email</span>
            <Input
              type='email'
              disabled
              defaultValue={email}
              className='cursor-not-allowed disabled:text-gray-400'
            />
          </label>

          <Button disabled={state === 'submitting' || state === 'loading'}>
            save
          </Button>
        </Form>
      </main>
    </>
  )
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData()
  const name = formData.get('name')

  const user = await verifyUser(request)

  if (!('id' in user)) return user

  if (name && typeof name === 'string' && name.trim().length > 0) {
    await db.update(users).set({ name }).where(eq(users.id, user.id))
    return json({ message: 'Profile updated successfully' })
  }

  return json({ error: 'Name cannot be empty' })
}
