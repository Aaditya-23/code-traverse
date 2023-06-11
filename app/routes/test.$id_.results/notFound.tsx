import { Link } from '@remix-run/react'

export default function NotFound() {
  return (
    <main className='mx-auto w-max p-2'>
      <h1 className='mt-8 text-3xl font-semibold'>
        Sorry, the requested page does not exist
      </h1>

      <Link to='/' className='uppercase text-blue-300 underline'>
        home page
      </Link>
    </main>
  )
}
