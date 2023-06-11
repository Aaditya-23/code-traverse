import type { LoaderArgs } from '@remix-run/node'
import { authenticator } from '~/services/auth.server'
import invariant from 'tiny-invariant'

export function loader({ request, params }: LoaderArgs) {
  const { provider } = params
  invariant(provider && (provider === 'google' || provider === 'github'))

  return authenticator.authenticate(provider, request, {
    successRedirect: '/home',
    failureRedirect: '/auth',
  })
}
