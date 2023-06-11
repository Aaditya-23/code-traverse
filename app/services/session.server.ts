import { createCookieSessionStorage } from '@remix-run/node'

const sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) throw new Error('No session secret found')

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '_session',
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secrets: sessionSecret,
    secure: process.env.NODE_ENV === 'production',
  },
})
