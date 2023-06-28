import { Footer, Navbar } from '~/layouts'
import { BsBook } from 'react-icons/bs'
import { Form, Link, useLoaderData, useNavigate } from '@remix-run/react'
import { useState } from 'react'
import { Button, Input } from '~/components'
import { users, type User } from '~/db/schema.server'
import { type ActionArgs, json, type LoaderArgs } from '@remix-run/node'
import { authenticator } from '~/services/auth.server'
import { db } from '~/db/drizzle.server'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

export async function loader({ request }: LoaderArgs) {
  const userFromSession = await authenticator.isAuthenticated(request)

  if (!userFromSession) return json({ user: null })

  const user = await db.query.users.findFirst({
    where: eq(users.id, userFromSession.id),
    columns: {
      createdAt: false,
    },
  })

  if (!user)
    return await authenticator.logout(request, { redirectTo: 'logout' })

  return json({ user })
}

export default function Contact() {
  const { user } = useLoaderData<typeof loader>()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Navbar user={user} />

      <main className='space-y-12'>
        <div className='flex flex-col items-center justify-center gap-10'>
          <div className='relative flex items-center justify-center'>
            <BsBook color='white' size='2em' />
            <div className='absolute -z-10 animate-spin-slow rounded-full bg-help-gradient p-10 blur-md' />
          </div>

          <p className='text-center text-3xl font-extrabold'>
            How can we help ?
          </p>
        </div>

        <div className='flex justify-center gap-4 font-medium text-white'>
          <Link
            to='#contact-form'
            className='w-28 rounded-md bg-pink-600 py-2 text-center uppercase shadow sm:w-32 sm:text-xl'
          >
            faq's
          </Link>
          <button
            onClick={() => setIsOpen(true)}
            className='w-28 rounded-md bg-black py-2 text-center capitalize text-white shadow sm:w-32 sm:text-xl'
          >
            contact us
          </button>
        </div>

        {isOpen && <ContactForm user={user} />}
        
        <div id='#guidelines' className='space-y-5 px-2 py-4 text-gray-600'>
          <p className='text-2xl font-semibold capitalize text-black'>
            guidelines
          </p>

          <p className='text-justify'>
            These guidelines serve as a helpful resource to navigate the testing
            process effectively. It's important to adhere to these guidelines
            for a successful experience.
          </p>

          <ol className='list-decimal space-y-2 px-4 text-justify'>
            <li className=''>
              All questions must be answered as they are mandatory, and there is
              no time limit for the tests.
            </li>

            <li className=''>
              The scores obtained in these tests are not significant; they are
              designed specifically for self-assessment in a particular field.
              It is recommended to answer all questions independently without
              seeking assistance.
            </li>

            <li className=''>
              If needed, you can choose to continue the test at a later time. To
              resume the test from where you left off, simply access the &nbsp;
              <Link to='#' className='text-blue-500 underline'>
                My Tests section
              </Link>
              &nbsp; section.
            </li>

            <li className=''>
              If you encounter a question that you believe is incorrect or the
              answer options are invalid, you have the option to report the
              question. However, please ensure that you still select a response.
            </li>

            <li className=''>
              It is valuable to review your solutions after completing the test,
              identifying areas for improvement, reflecting on mistakes made,
              and utilizing the feedback to enhance your skills.
            </li>
          </ol>
        </div>

        <div className='flex h-96 flex-col items-center justify-center gap-8 border-t bg-[#fcfcfc] p-3 lg:flex-row lg:justify-around'>
          <div className='space-y-8'>
            <div className='flex flex-col items-center gap-2 text-4xl font-extrabold sm:flex-row sm:text-6xl'>
              <p className='animate-color-test bg-test-gradient bg-clip-text'>
                Test.
              </p>
              <p className='animate-color-evaluate bg-evaluate-gradient bg-clip-text'>
                Evaluate.
              </p>
              <p className='animate-color-advance bg-advance-gradient bg-clip-text'>
                Advance.
              </p>
            </div>

            <p className='text-center text-gray-600 sm:text-left sm:text-xl'>
              Take specialized skill assessments designed for software
              engineers.
            </p>
          </div>

          <Link
            className='text-md block rounded-lg bg-black px-10 py-3 font-medium text-white shadow hover:bg-black/80 sm:text-xl'
            to='#guidelines'
          >
            Start Now
          </Link>
        </div>
      </main>

      <Footer />
    </>
  )
}

function ContactForm({ user }: { user: Omit<User, 'createdAt'> | null }) {
  return (
    <div className='mx-auto w-[90vw] max-w-[650px] space-y-10 rounded-md bg-[#fcfcfc] p-3 shadow-xl outline outline-black/10 sm:rounded-xl sm:p-4'>
      <div className='space-y-2'>
        <p className='text-2xl font-extrabold'>We'd love to help</p>
        <p className='text-sm font-medium text-gray-600'>
          Reach out and we will get in touch as soon as possible.
        </p>
      </div>

      <Form className='flex flex-col gap-6' method='post'>
        <fieldset
          className='flex flex-col gap-2 disabled:text-gray-700 sm:flex-row'
          disabled={user ? true : false}
        >
          <Input
            className='w-full'
            name='name'
            placeholder='Name'
            value={user?.name}
            readOnly={user ? true : false}
            required
          />
          <Input
            className='w-full'
            name='email'
            placeholder='Email'
            value={user?.email}
            readOnly={user ? true : false}
            required
          />
        </fieldset>

        <div className='flex flex-col gap-3'>
          <Input name='subject' placeholder='Subject' required />
          <textarea
            name='message'
            cols={30}
            rows={10}
            className='resize-none rounded-md p-2 outline outline-2 outline-black/10 focus:outline-blue-500'
            placeholder='Leave us a message...'
            required
          ></textarea>
        </div>
        <Button>send message</Button>
      </Form>
    </div>
  )
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)

  const dataSchema = z.object({
    name: z.string({
      invalid_type_error: 'name should be a string',
      required_error: 'name is required',
    }),
    email: z
      .string({
        invalid_type_error: 'email should be a string',
        required_error: 'email is required',
      })
      .email({ message: 'email is invalid' }),
    subject: z.string({
      invalid_type_error: 'subject should be a string',
      required_error: 'subject is required',
    }),
    message: z.string({
      invalid_type_error: 'message should be a string',
      required_error: 'message is required',
    }),
  })

  const parsedData = dataSchema.safeParse(data)

  if (parsedData.success) {
    return json({ success: true })
  }

  return json({ success: false })
}
