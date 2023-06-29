import { useRef } from 'react'
import { FiSearch } from 'react-icons/fi'

export default function Searchbar({
  query,
  setQuery,
}: {
  query: string
  setQuery(value: string): void
}) {
  const ref = useRef<HTMLInputElement>(null)

  return (
    <div
      onClick={() => ref.current?.focus()}
      className='flex w-max flex-1 cursor-text items-center rounded-md border px-3 py-2 text-sm text-gray-600 outline-none ring-2 ring-transparent focus-within:border-transparent focus-within:ring-blue-500 sm:text-base'
    >
      <input
        ref={ref}
        placeholder='Search for tests...'
        className='w-full outline-none'
        onChange={(e) => setQuery(e.target.value)}
      />
      <FiSearch />
    </div>
  )
}
