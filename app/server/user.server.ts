import { eq } from 'drizzle-orm'
import { db } from '~/db/drizzle.server'
import { users } from '~/db/schema.server'
import { authenticator } from '~/services/auth.server'
import { redirect } from '@remix-run/node'

export async function fetchUser(email: string) {
  return db.select().from(users).where(eq(users.email, email))
}

export async function userExists(email: string) {
  return (await fetchUser(email)).length > 0 ? true : false
}

export async function verifyUser(request: Request) {
  const authenticatedUser = await authenticator.isAuthenticated(request)

  if (!authenticatedUser) return redirect('/auth')

  const userExistsInDb = await userExists(authenticatedUser.email)

  if (!userExistsInDb)
    return authenticator.logout(request, {
      redirectTo: '/auth',
    })

  return authenticatedUser
}

export async function createOrLoginUser(name: string, email: string) {
  const user = await fetchUser(email)

  if (user.length > 0) return user[0]

  const newUser = await db.insert(users).values({ email, name }).returning()
  return newUser[0]
}
