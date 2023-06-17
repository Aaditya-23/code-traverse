import { Form, useSubmit } from '@remix-run/react'
import { Button } from '~/components'
import { Navbar } from '~/layouts'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'

export default function Auth() {
  const submit = useSubmit()
  function handleClick(provider: 'google' | 'github') {
    submit(null, { method: 'post', action: `/auth/${provider}` })
  }

  return (
    <>
      <Navbar user={null} />
      <main className='mx-auto mt-5 flex w-max flex-col items-center space-y-5'>
        <h1 className='text-2xl font-medium capitalize'>
          continue to code traverse
        </h1>
        <button
          onClick={() => handleClick('google')}
          className='flex w-full items-center justify-center gap-3 rounded-md bg-black p-1 capitalize text-white shadow-md outline-offset-2 hover:bg-black/80 focus:bg-black/80'
        >
          google <FcGoogle />
        </button>
        <div>or</div>
        <button
          onClick={() => handleClick('github')}
          className='flex w-full items-center justify-center gap-3 rounded-md bg-black p-1 capitalize text-white shadow-md outline-offset-2 hover:bg-black/80 focus:bg-black/80 '
        >
          github <FaGithub />
        </button>
      </main>
    </>
  )
}
