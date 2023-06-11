import type { V2_MetaFunction } from '@remix-run/node'
import { Link } from '@remix-run/react'

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Code Traverse' },
    { name: 'Analyze your skills', content: 'Welcome to Code Traverse!' },
  ]
}

export default function Index() {
  return (
    <main>
      <nav className='mt-2 space-x-3'>
        <Link to='#' className='rounded-md border-2 p-1'>
          blog
        </Link>
        <Link to='#' className='rounded-md border-2 p-1'>
          learn
        </Link>
        <Link to='/home' className='rounded-md border-2 p-1'>
          test
        </Link>
      </nav>

      <div className='flex gap-3'>
        <Link to='auth/signup'>signup</Link>
        <Link to='auth/signin'>signin</Link>
      </div>
    </main>
  )
}
