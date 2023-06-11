import { Menu } from '@headlessui/react'
import { Link, useSubmit } from '@remix-run/react'
import { Fragment } from 'react'

type UserMenuProps = {
  user: { name: string }
}

export default function UserMenu(props: UserMenuProps) {
  const { user } = props

  const submit = useSubmit()

  function logout() {
    submit(null, {
      method: 'post',
      action: '/auth/logout',
    })
  }

  return (
    <Menu as='div' className='relative'>
      <Menu.Button className='underline-offset-2 outline-none focus:underline'>
        {user.name}
      </Menu.Button>

      <Menu.Items
        as='div'
        className='absolute mt-2 flex w-full flex-col overflow-hidden rounded-lg bg-white shadow-lg outline outline-black/10'
      >
        <Menu.Item as={Fragment}>
          {({ active }) => (
            <Link
              className={`p-2 capitalize ${active && 'bg-black/80 text-white'}`}
              to='/user/profile'
            >
              profile
            </Link>
          )}
        </Menu.Item>

        <Menu.Item as={Fragment}>
          {({ active }) => (
            <Link
              className={`p-2 capitalize ${
                active && 'bg-black/80 text-white'
              } outline-none`}
              to='/user/account'
            >
              account
            </Link>
          )}
        </Menu.Item>

        <Menu.Item as={Fragment}>
          {({ active }) => (
            <Link
              className={`p-2 capitalize ${
                active && 'bg-black/80 text-white'
              } outline-none`}
              to='/user/tests'
            >
              my tests
            </Link>
          )}
        </Menu.Item>

        <Menu.Item as={Fragment}>
          {({ active }) => (
            <button
              className={`p-2 capitalize ${
                active && 'bg-black/80 text-white'
              } text-left`}
              onClick={logout}
            >
              logout
            </button>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  )
}
