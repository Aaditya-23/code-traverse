import { type LoaderArgs } from '@remix-run/node'
import { Form } from '@remix-run/react'
import { db } from '~/db/drizzle.server'
import { questions } from '~/db/schema.server'
import { Navbar } from '~/layouts'

export async function loader({ request }: LoaderArgs) {
  return null
}

export default function Admin() {
  return (
    <div>
      <Navbar user={null} />
      <h1>create test</h1>
      <h2>delete test</h2>
      <h3>manage admins</h3>
      <h4>edit tests</h4>
      <h4>manage bug reports and question remarks</h4>
      <Form method='post'>
        <button type='submit'>submit</button>
      </Form>
    </div>
  )
}

export async function action() {
  const ques = [
    {
      question: 'what is react',
      answer: ['library'],
      options: ['framework', 'xyz', 'xyx', 'joy'],
      testId: 'de0baa96-d349-42b5-ad98-f6c83a4ac328',
    },
    {
      question: 'what is remix',
      answer: ['library'],
      options: ['framework', 'xyz', 'xyx', 'joy'],
      testId: 'de0baa96-d349-42b5-ad98-f6c83a4ac328',
    },
    {
      question: 'what is next',
      answer: ['library'],
      options: ['framework', 'xyz', 'xyx', 'joy'],
      testId: 'de0baa96-d349-42b5-ad98-f6c83a4ac328',
    },
    {
      question: 'what is vue',
      answer: ['library'],
      options: ['framework', 'xyz', 'xyx', 'joy'],
      testId: 'de0baa96-d349-42b5-ad98-f6c83a4ac328',
    },
    {
      question: 'what is qwik',
      answer: ['library'],
      options: ['framework', 'xyz', 'xyx', 'joy'],
      testId: 'de0baa96-d349-42b5-ad98-f6c83a4ac328',
    },
    {
      question: 'what is solid',
      answer: ['library'],
      options: ['framework', 'xyz', 'xyx', 'joy'],
      testId: 'de0baa96-d349-42b5-ad98-f6c83a4ac328',
    },
    {
      question: 'what is svelte',
      answer: ['library'],
      options: ['framework', 'xyz', 'xyx', 'joy'],
      testId: 'de0baa96-d349-42b5-ad98-f6c83a4ac328',
    },
    {
      question: 'what is angular',
      answer: ['library'],
      options: ['framework', 'xyz', 'xyx', 'joy'],
      testId: 'de0baa96-d349-42b5-ad98-f6c83a4ac328',
    },
  ]
  await db.insert(questions).values(ques)
  return null
}
