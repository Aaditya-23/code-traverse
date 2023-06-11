import { Disclosure } from '@headlessui/react'
import { Fragment } from 'react'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'

type UserResponseProps = {
  question: string
  answers: Array<string>
  options: Array<string>
  userResponse: Array<string>
}

export default function UserResponse({
  answers,
  options,
  question,
  userResponse,
}: UserResponseProps) {
  return (
    <Disclosure as='div' className='mx-auto w-3/5 space-y-5'>
      {({ open }) => (
        <>
          <Disclosure.Button className='flex w-full items-center justify-between rounded-lg px-4 py-2 font-semibold outline outline-black/10'>
            {question}
            {open ? <IoIosArrowDown /> : <IoIosArrowUp />}
          </Disclosure.Button>

          <Disclosure.Panel className='space-y-8 px-4'>
            <fieldset disabled className='space-y-2'>
              {options.map((option, index) => {
                const isCorrect = answers.includes(option)
                const isChecked = userResponse.includes(option)

                return (
                  <label key={index} className='flex items-center gap-3'>
                    <input type='checkbox' checked={isChecked} readOnly />

                    <span
                      className={
                        isCorrect
                          ? 'text-green-400'
                          : isChecked
                          ? 'text-red-400'
                          : ''
                      }
                    >
                      {option}
                    </span>
                  </label>
                )
              })}
            </fieldset>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
