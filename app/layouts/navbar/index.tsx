import { Link } from '@remix-run/react'
import { UserMenu } from '~/components'
import type { User } from '~/db/schema.server'

type NavbarProps = {
  user: Omit<User, 'createdAt'> | null
}

export default function Navbar(props: NavbarProps) {
  const { user } = props

  return (
    <nav className='mb-5 flex items-center justify-around bg-black/10 p-3 drop-shadow-md'>
      <Link to='/home'>
        <Logo />
      </Link>

      {user ? <UserMenu user={{ name: user.name }} /> : <Login />}
    </nav>
  )
}

function Login() {
  return (
    <Link
      to='/auth'
      className='rounded-full border-2 border-black px-3 py-1 text-sm font-semibold uppercase tracking-wider'
    >
      login
    </Link>
  )
}

function Logo() {
  return (
    <svg
      width='45'
      height='27'
      viewBox='0 0 45 27'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M32.8751 4C32.8751 4 17.2114 4 9.44696 4C1.6825 4 2.70414 22.4703 9.44696 22.4703C16.1898 22.4703 23.6677 22.4703 23.6677 22.4703M32.8751 4L45 4M32.8751 4C32.8751 6.87587 32.8751 26.5 32.8751 26.5'
        stroke='black'
        strokeWidth='7'
      />
    </svg>
  )
}
