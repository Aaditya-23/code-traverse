import { Authenticator } from 'remix-auth'
import { GoogleStrategy } from 'remix-auth-google'
import { GitHubStrategy } from 'remix-auth-github'
import { sessionStorage } from './session.server'
import { createOrLoginUser } from '~/server/user.server'

if (typeof process.env.GOOGLE_CLIENT_ID !== 'string')
  throw new Error('Google Client id not found')
if (typeof process.env.GOOGLE_CLIENT_SECRET !== 'string')
  throw new Error('Google Client secret not found')

if (typeof process.env.GITHUB_CLIENT_ID !== 'string')
  throw new Error('Github Client id not found')
if (typeof process.env.GITHUB_CLIENT_SECRET !== 'string')
  throw new Error('Github Client secret not found')

let googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3001/auth/google/callback',
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    const {
      name: { familyName, givenName },
      emails,
    } = profile

    const name = `${givenName} ${familyName}`
    const email = emails[0].value

    const user = await createOrLoginUser(name, email)

    return { id: user.id, email: user.email }
  }
)

let gitHubStrategy = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:3001/auth/github/callback',
  },
  async ({ accessToken, extraParams, profile }) => {
    const {
      name: { givenName },
      emails,
    } = profile

    const name = givenName
    const email = emails[0].value

    const user = await createOrLoginUser(name, email)

    return { id: user.id, email: user.email }
  }
)

type User = {
  id: string
  email: string
}

export let authenticator = new Authenticator<User>(sessionStorage)

authenticator.use(googleStrategy)
authenticator.use(gitHubStrategy)
