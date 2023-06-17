import { json, type LoaderArgs, type V2_MetaFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { BsTwitter, BsGithub, BsSun, BsFillMoonFill } from 'react-icons/bs'
import { HiComputerDesktop } from 'react-icons/hi2'
import { Navbar } from '~/layouts'
import { authenticator } from '~/services/auth.server'

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Code Traverse' },
    { name: 'Analyze your skills', content: 'Welcome to Code Traverse!' },
  ]
}

export async function loader({ request }: LoaderArgs) {
  const user = await authenticator.isAuthenticated(request)
  if (!user) return json(user)

  // const authenticatedUser = await user
  
}

export default function Index() {
  const user = useLoaderData<typeof loader>()

  return (
    <>
      <Navbar user={null} />

      <main className='mb-10 space-y-28 p-2'>
        <div className='space-y-8'>
          <div className='flex flex-col items-center justify-center gap-2 text-6xl font-extrabold md:flex-row'>
            <p className='animate-color-test bg-test-gradient bg-clip-text'>
              Test.
            </p>
            <p className='animate-color-evaluate bg-evaluate-gradient bg-clip-text'>
              Evaluate.
            </p>
            <p className='animate-color-advance bg-advance-gradient bg-clip-text'>
              Advance
            </p>
          </div>

          <p className='relative text-center font-medium text-gray-600'>
            Take specialized skill assessments designed for software engineers.
            <img src='./blob.png' alt='blob' className='absolute -z-10' />
          </p>
        </div>

        <Link
          className='text-md mx-auto block w-max rounded-lg bg-black px-4 py-2 font-medium text-white shadow hover:bg-black/80'
          to='#'
        >
          Join Now
        </Link>

        <section className='space-y-24'>
          <Test />
          <Evaluate />
          <Advance />
        </section>
      </main>

      <Footer />
    </>
  )
}

function Test() {
  return (
    <div className='flex flex-col items-center gap-5'>
      <div className=''>
        <div className='mx-auto h-20 w-px bg-black bg-gradient-to-t from-[#36D1DC] to-white' />
        <div className='flex aspect-square w-12 items-center justify-center rounded-full bg-test-gradient text-sm font-bold capitalize text-white'>
          1
        </div>
      </div>

      <p className='bg-test-gradient bg-clip-text text-2xl font-extrabold capitalize text-transparent sm:text-3xl'>
        test
      </p>

      <p className='text-center text-3xl font-extrabold'>
        Test when you learn something new
      </p>
      <p className='text-center  text-gray-500'>
        Test and Analyze Your Abilities with Expertly Crafted Assessments.
      </p>
    </div>
  )
}

function Evaluate() {
  return (
    <div className='flex flex-col items-center gap-5'>
      <div className=''>
        <div className='mx-auto h-20 w-px bg-black bg-gradient-to-t from-[#8A2387] to-white' />
        <div className='flex aspect-square w-12 items-center justify-center rounded-full bg-evaluate-gradient text-sm font-bold capitalize text-white'>
          2
        </div>
      </div>

      <p className='bg-evaluate-gradient bg-clip-text text-2xl font-extrabold capitalize text-transparent sm:text-3xl'>
        evaluate
      </p>

      <p className='text-center text-3xl font-extrabold'>
        Analyze test results and provide comprehensive feedback
      </p>
      <p className='text-center text-gray-500'>
        Evaluation of user performance. Metrics, scores, and personalized
        insights are provided to help users understand their skill level.
      </p>
    </div>
  )
}

function Advance() {
  return (
    <div className='flex flex-col items-center gap-5'>
      <div className=''>
        <div className='mx-auto h-20 w-px bg-black bg-gradient-to-t from-[#C02425] to-white' />
        <div className='flex aspect-square w-12 items-center justify-center rounded-full bg-advance-gradient text-sm font-bold capitalize text-white'>
          3
        </div>
      </div>

      <p className='bg-advance-gradient bg-clip-text text-2xl font-extrabold capitalize text-transparent sm:text-3xl'>
        advance
      </p>

      <p className='text-center text-3xl font-extrabold'>
        Facilitate professional growth and progress in software engineering
      </p>
      <p className='text-center  text-gray-500'>
        Learn from your mistakes and improve on the areas where you
        underperformed to become a better software engineer.
      </p>
    </div>
  )
}

function Footer() {
  return (
    <footer className='flex flex-col justify-between gap-8 border-t border-t-gray-200 bg-[#fafafa] p-2 text-gray-600'>
      <div className='flex divide-x-2'>
        <a href='twitter.com' className='flex h-6 w-8 place-items-center'>
          <BsTwitter className='mx-auto' />
        </a>
        <a href='github.com' className='flex h-6 w-8 place-items-center'>
          <BsGithub className='mx-auto' />
        </a>
      </div>

      <div className='flex gap-5 text-xs'>
        <Link to='/' className='block capitalize underline underline-offset-2'>
          blogs
        </Link>
        <Link to='/' className='block capitalize underline underline-offset-2'>
          tests
        </Link>
        <Link to='/' className='block capitalize underline underline-offset-2'>
          contact us
        </Link>
      </div>

      <p className='text-xs'>
        Copyright Information: © 2023 CODE TRAVERSE.
        <br /> All rights reserved.
      </p>

      <div className='flex w-max items-center gap-2 self-center rounded-full border p-2'>
        <button>
          <BsFillMoonFill />
        </button>

        <button>
          <BsSun size='1.2em' />
        </button>

        <button>
          <HiComputerDesktop size='1.2em' />
        </button>
      </div>
    </footer>
  )
}
