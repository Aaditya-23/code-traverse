import { Listbox, Menu, Popover } from '@headlessui/react'
import { json, type LoaderArgs } from '@remix-run/node'
import { Form, Link, useLoaderData } from '@remix-run/react'
import { useState } from 'react'
import { Searchbar } from '~/components'
import { db } from '~/db/drizzle.server'
import { tests, type Test, users } from '~/db/schema.server'
import { Navbar } from '~/layouts'
import { BsFilter } from 'react-icons/bs'
import { IoMdAdd } from 'react-icons/io'
import TestCard from './testCard'
import { and, eq } from 'drizzle-orm'
import { authenticator } from '~/services/auth.server'

type FiltersType =
  | 'most-performant'
  | 'least-performant'
  | 'most-popular'
  | 'least-popular'
  | 'date-added'

export async function loader({ request }: LoaderArgs) {
  const allTests = await db.query.tests.findMany({
    where: eq(tests.isArchived, false),
    columns: {
      createdAt: false,
    },
  })

  const userFromSession = await authenticator.isAuthenticated(request)

  if (!userFromSession)
    return await authenticator.logout(request, { redirectTo: '/auth' })

  const user = await db.query.users.findFirst({
    where: and(eq(users.id, userFromSession.id), eq(users.isAdmin, true)),
  })

  if (!user) return await authenticator.logout(request, { redirectTo: '/auth' })

  return json({ user, tests: allTests })
}

export default function Admin() {
  const { user, tests } = useLoaderData<typeof loader>()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<FiltersType>('most-popular')

  return (
    <>
      <Navbar user={user} />

      <main className='px-2'>
        <div className='flex gap-2'>
          <Searchbar query={query} setQuery={(value) => setQuery(value)} />
          <Filters filter={filter} setFilters={(filter) => setFilter(filter)} />
          <Link
            to='#'
            className='flex items-center gap-2 rounded-lg bg-black px-2 uppercase text-white'
          >
            new test <IoMdAdd size='1.2em' />
          </Link>
        </div>

        <AllTests tests={tests} />
      </main>
    </>
  )
}

function AllTests({ tests }: { tests: Array<Omit<Test, 'createdAt'>> }) {
  return tests.map((test, index) => <TestCard {...test} key={index} />)
}

function Filters({
  filter,
  setFilters,
}: {
  filter: FiltersType
  setFilters(filter: FiltersType): void
}) {
  return (
    <Popover className='relative text-sm'>
      <Popover.Button className='flex h-full items-center gap-2 rounded border px-4 uppercase text-gray-600 outline-none ring-2 ring-transparent focus:border-transparent focus:ring-blue-500 sm:text-base'>
        sort by <BsFilter size='1.2em' />
      </Popover.Button>

      <Popover.Panel
        as='form'
        className='absolute right-0 mt-4 w-max rounded-md bg-white shadow-lg outline outline-black/10'
      >
        <label className='flex items-center gap-2 px-3 py-3 capitalize hover:bg-black/5'>
          <input
            type='radio'
            name='sort-by'
            checked={filter === 'most-popular'}
            onChange={(e) => setFilters('most-popular')}
          />
          <span>most popular</span>
        </label>

        <label className='flex items-center gap-2 px-3 py-3 capitalize hover:bg-black/5'>
          <input
            type='radio'
            name='sort-by'
            checked={filter === 'least-popular'}
            onChange={(e) => setFilters('least-popular')}
          />
          <span>least popular</span>
        </label>

        <label className='flex items-center gap-2 px-3 py-3 capitalize hover:bg-black/5'>
          <input
            type='radio'
            name='sort-by'
            checked={filter === 'most-performant'}
            onChange={(e) => setFilters('most-performant')}
          />
          <span>most performant</span>
        </label>

        <label className='flex items-center gap-2 px-3 py-3 capitalize hover:bg-black/5'>
          <input
            type='radio'
            name='sort-by'
            checked={filter === 'least-performant'}
            onChange={(e) => setFilters('least-performant')}
          />
          <span>least performant</span>
        </label>

        <label className='flex items-center gap-2 px-3 py-3 capitalize hover:bg-black/5'>
          <input
            type='radio'
            name='sort-by'
            checked={filter === 'date-added'}
            onChange={(e) => setFilters('date-added')}
          />
          <span>date added</span>
        </label>
      </Popover.Panel>
    </Popover>
  )
}
