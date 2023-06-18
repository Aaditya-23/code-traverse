import { eq } from 'drizzle-orm'
import { db } from '~/db/drizzle.server'
import { users } from '~/db/schema.server'
import { authenticator } from '~/services/auth.server'
import { redirect } from '@remix-run/node'

export async function userExistsInDb(id: string) {
  return (await db.query.users.findFirst({
    where: eq(users.id, id),
    columns: { id: true },
  }))
    ? true
    : false
}

export async function verifyUser(request: Request) {
  const authenticatedUser = await authenticator.isAuthenticated(request)

  if (!authenticatedUser) return redirect('/auth')

  const userExists = await userExistsInDb(authenticatedUser.id)

  if (!userExists)
    return authenticator.logout(request, {
      redirectTo: '/auth',
    })

  return authenticatedUser
}

export async function createOrLoginUser(name: string, email: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
    columns: { id: true },
  })

  if (user) return user

  const newUser = await db
    .insert(users)
    .values({ email, name })
    .returning({ id: users.id })
  return newUser[0]
}
