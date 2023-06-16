import { Link } from '@remix-run/react'
import { twMerge } from 'tailwind-merge'

export default function Logo(props: { className?: string }) {
  const tailwindClass = twMerge('flex items-center', props.className)

  return (
    <Link to='/' className={tailwindClass}>
      <svg
        id='visual'
        viewBox='0 0 50 50'
        width='50'
        height='50'
        xmlns='http://www.w3.org/2000/svg'
        xmlnsXlink='http://www.w3.org/1999/xlink'
        version='1.1'
      >
        <g transform='translate(25.203973619669917 23.248637991544214)'>
          <path
            d='M12.3 -11C16.2 -8.5 19.6 -4.2 18.9 -0.6C18.3 2.9 13.6 5.9 9.7 9.1C5.9 12.2 2.9 15.6 -1.5 17.1C-5.9 18.6 -11.8 18.1 -15.3 15C-18.8 11.8 -19.9 5.9 -19.2 0.7C-18.5 -4.5 -16 -9 -12.5 -11.5C-9 -14 -4.5 -14.5 -0.1 -14.4C4.2 -14.2 8.5 -13.5 12.3 -11'
            fill='#272526'
          ></path>
        </g>
      </svg>

      <h1 className='whitespace-nowrap font-kablammo text-2xl font-bold uppercase tracking-wider sm:text-3xl'>
        code traverse
      </h1>
    </Link>
  )
}
