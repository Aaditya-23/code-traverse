import {
  type ActionArgs,
  type LoaderArgs,
  json,
  redirect,
} from '@remix-run/node'
import { Form, useLoaderData, useNavigation } from '@remix-run/react'
import { and, eq, isNull } from 'drizzle-orm'
import { useEffect, useRef, useState } from 'react'
import { z } from 'zod'
import { Button } from '~/components'
import { db } from '~/db/drizzle.server'
import { responses, userTests } from '~/db/schema.server'
import { endTest, submitAnswer } from '~/server/test.server'
import { userExistsInDb } from '~/server/user.server'
import Modal from './modal'
import TestCompleted from './testCompleted'
import { authenticator } from '~/services/auth.server'
import Report from './report'

export async function loader({ request, params }: LoaderArgs) {
  const { id } = params

  const test = await db.query.userTests.findFirst({
    columns: { id: true, testCompleted: true },
    where: eq(userTests.id, id || ''),
    with: {
      test: {
        columns: {
          name: true,
        },
      },
    },
  })

  if (!test) throw new Error('invalid test id')

  if (test.testCompleted) return json({ testCompleted: true })

  const response = await db.query.responses.findFirst({
    columns: {
      id: true,
    },
    where: and(isNull(responses.isCorrect), eq(responses.userTestId, test.id)),
    with: {
      question: {
        columns: {
          question: true,
          options: true,
        },
      },
    },
  })

  if (!response) return endTest(test.id, '/home')

  return json({ response, test: test.test.name })
}

export default function Test() {
  const data = useLoaderData<typeof loader>()
  const { state } = useNavigation()

  const [isOpen, setIsOpen] = useState(false)

  function handleModal(state: boolean) {
    setIsOpen(state)
  }

  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state === 'idle') formRef.current?.reset()
  }, [state])

  if ('testCompleted' in data) {
    return <TestCompleted />
  }

  const { response, test } = data

  return (
    <main className='space-y-8 p-2'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold uppercase'>{test}</h1>
        <Button
          onClick={() => handleModal(true)}
          className='bg-transparent text-sm font-normal text-red-500 outline-red-500 hover:bg-red-500 hover:text-white focus:bg-red-500 focus:text-white'
        >
          end test
        </Button>
        <Modal closeModal={() => handleModal(false)} isOpen={isOpen} />
      </div>

      <div className='mx-auto flex w-4/5 flex-col justify-between gap-4 md:flex-row'>
        <p className='text-lg font-medium'>{response.question.question}</p>
        <Form ref={formRef} className='flex flex-col gap-4' method='post'>
          <p className='text-sm text-gray-600'>Multiple Choice Question</p>

          {response.question.options.map((opt, index) => (
            <label key={index} className='flex w-max items-center gap-2'>
              <input
                type='checkbox'
                name='answers'
                value={opt}
                className='h-4 w-4 text-white'
              />
              <span className='text-sm sm:text-base'>{opt}</span>
            </label>
          ))}

          <input type='hidden' name='responseId' value={response.id} />

          <div className='flex justify-between gap-2'>
            <Button
              type='submit'
              disabled={state === 'submitting' || state === 'loading'}
              className='self-start'
            >
              next
            </Button>

            <Report />
          </div>
        </Form>
      </div>
    </main>
  )
}

export async function action({ request, params }: ActionArgs) {
  const userFromSession = await authenticator.isAuthenticated(request)

  if (!userFromSession) return redirect('/auth')

  const userExists = await userExistsInDb(userFromSession.id)

  if (!userExists)
    return await authenticator.logout(request, { redirectTo: '/auth' })

  const formData = await request.formData()
  const userTestId = params.id || ''

  // TODO: change redirect url here
  const shouldEndTheTest = formData.get('endTest')
  if (shouldEndTheTest) return endTest(userTestId, '/home')

  const data = {
    answers: formData.getAll('answers'),
    responseId: formData.get('responseId'),
  }

  const result = z
    .object({
      answers: z.string().array(),
      responseId: z.string(),
    })
    .safeParse(data)

  if (!result.success) throw new Error('an error occured')

  const { answers, responseId } = result.data

  return submitAnswer({ answers, responseId })
}
