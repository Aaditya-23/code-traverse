import { Link } from '@remix-run/react'
import { BsTwitter, BsGithub, BsSun, BsFillMoonFill } from 'react-icons/bs'
import { HiComputerDesktop } from 'react-icons/hi2'

export default function Footer() {
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
