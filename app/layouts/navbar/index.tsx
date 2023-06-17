import { Dialog, Listbox } from '@headlessui/react'
import { Link } from '@remix-run/react'
import { Logo } from '~/components'
import { HiOutlineMenuAlt4 } from 'react-icons/hi'
import { IoIosArrowDown } from 'react-icons/io'
import { BsSun, BsFillMoonFill } from 'react-icons/bs'
import { HiComputerDesktop } from 'react-icons/hi2'
import { RxCross2 } from 'react-icons/rx'
import { useState } from 'react'
import type { User } from '~/db/schema.server'

type UserProps = {
  user: Omit<User, 'createdAt'> | null
}

type NavbarProps = UserProps & {}

export default function Navbar({ user }: NavbarProps) {
  return (
    <nav className='mb-24 flex items-center justify-between p-2 sm:justify-around'>
      <Logo />

      <div className='hidden space-x-3 text-xs font-medium capitalize'>
        <Link to='#' className='inline-block underline underline-offset-2'>
          tests
        </Link>
        <Link to='#' className='inline-block underline underline-offset-2'>
          blog
        </Link>
      </div>

      <Menu user={user} />
    </nav>
  )
}

function Menu({ user }: UserProps) {
  const [open, setOpen] = useState(true)

  return (
    <div className='relative'>
      <button onClick={() => setOpen(true)}>
        <HiOutlineMenuAlt4 size='2em' />
      </button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Panel className='fixed top-0 h-screen w-full space-y-8 bg-white p-2'>
          <header className='flex justify-end'>
            <button onClick={() => setOpen(false)}>
              <RxCross2 size='2em' />
            </button>
          </header>

          {user && (
            <Link
              to='#'
              className='block rounded-md border p-2 text-center text-sm capitalize hover:bg-black hover:text-white focus:bg-black focus:text-white sm:text-base'
            >
              contact
            </Link>
          )}

          {!user && (
            <Link
              to='/auth'
              className='block rounded-md border p-2 text-center text-sm capitalize hover:bg-black hover:text-white focus:bg-black focus:text-white sm:text-base'
            >
              login
            </Link>
          )}

          <ul className='flex flex-col text-sm font-medium sm:text-lg [&_li]:py-3'>
            {user && <li className='mb-4 text-gray-500 font-normal'>{user.email}</li>}
            <a href='#'>
              <li className='border-b capitalize text-gray-500 hover:bg-gray-100'>
                blog
              </li>
            </a>

            <Link to='#'>
              <li className='border-b capitalize text-gray-500 hover:bg-gray-100'>
                tests
              </li>
            </Link>

            {user && (
              <>
                <Link to='#'>
                  <li className='border-b capitalize text-gray-500 hover:bg-gray-100'>
                    profile
                  </li>
                </Link>

                <Link to='#'>
                  <li className='border-b capitalize text-gray-500 hover:bg-gray-100'>
                    account
                  </li>
                </Link>
              </>
            )}
            <Listbox value='light' as='div' className='relative'>
              <Listbox.Button className='w-full border-b capitalize text-gray-500 hover:bg-gray-100'>
                <li className='flex items-center justify-between'>
                  theme <IoIosArrowDown />
                </li>
              </Listbox.Button>

              <Listbox.Options className='absolute mt-1 w-full rounded-md bg-white shadow-md outline outline-black/10'>
                <Listbox.Option
                  value={'light'}
                  className={({ active, selected }) =>
                    `flex items-center gap-4 p-2 capitalize ${
                      (active || selected) && 'bg-[#F4F6F7]'
                    }`
                  }
                >
                  <BsSun />
                  light
                </Listbox.Option>
                <Listbox.Option
                  value={'system'}
                  className={({ active, selected }) =>
                    `flex items-center gap-4 p-2 capitalize ${
                      (active || selected) && 'bg-[#F4F6F7]'
                    }`
                  }
                >
                  <HiComputerDesktop />
                  system
                </Listbox.Option>
                <Listbox.Option
                  value={'dark'}
                  className={({ active, selected }) =>
                    `flex items-center gap-4 p-2 capitalize ${
                      (active || selected) && 'bg-[#F4F6F7]'
                    }`
                  }
                >
                  <BsFillMoonFill />
                  dark
                </Listbox.Option>
              </Listbox.Options>
            </Listbox>

            {user && (
              <>
                <Link to='#'>
                  <li className='border-b capitalize text-gray-500 hover:bg-gray-100'>
                    my results
                  </li>
                </Link>

                <Link to='#'>
                  <li className='border-b capitalize text-gray-500 hover:bg-gray-100'>
                    my bookings
                  </li>
                </Link>
              </>
            )}

            {user ? (
              <button>
                <li className='border-b text-left capitalize text-gray-500 hover:bg-gray-100'>
                  logout
                </li>
              </button>
            ) : (
              <Link to='#'>
                <li className='border-b capitalize text-gray-500 hover:bg-gray-100'>
                  contact
                </li>
              </Link>
            )}
          </ul>
        </Dialog.Panel>
      </Dialog>
    </div>
  )
}
