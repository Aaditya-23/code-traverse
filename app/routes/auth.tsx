import { Form } from '@remix-run/react'
import { Button } from '~/components'

export default function Auth() {
  return (
    <main className='mx-auto mt-5 flex w-max flex-col items-center space-y-5'>
      <h1 className='text-2xl font-medium uppercase'>continue with</h1>
      <Form method='post' action='/auth/google'>
        <Button>google</Button>
      </Form>
      <div>or</div>
      <Form method='post' action='/auth/github'>
        <Button>github</Button>
      </Form>
    </main>
  )
}
