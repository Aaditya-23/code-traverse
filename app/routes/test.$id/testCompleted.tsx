import { Link, useParams } from '@remix-run/react'

export default function TestCompleted() {
  const { id } = useParams()

  return (
    <main className='mx-auto w-max space-y-5 p-2'>
      <h1 className='text-2xl font-medium'>You have completed this test.</h1>
      <div className='flex justify-center gap-3'>
        <p>To see the results</p>
        <Link
          className='text-blue-400 underline underline-offset-2'
          to={`/test/${id}/results`}
        >
          click here
        </Link>
      </div>
    </main>
  )
}
