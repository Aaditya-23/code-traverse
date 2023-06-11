import type { ActionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { authenticator } from '~/services/auth.server'

export function loader() {
  return redirect('/auth')
}

export async function action({ request, params }: ActionArgs) {
  const { provider } = params
  invariant(provider && (provider === 'google' || provider === 'github'))

  return authenticator.authenticate(provider, request)
}
