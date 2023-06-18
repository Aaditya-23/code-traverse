import { useSubmit } from '@remix-run/react'
import type { Test } from '~/db/schema.server'
import Button from '../button'
import { SlChemistry } from 'react-icons/sl'
import { TbNotes } from 'react-icons/tb'

type TestCardProps = {
  test: Pick<
    Test,
    'id' | 'name' | 'imageUrl' | 'summary' | 'questionsToAttempt'
  >
}

export default function TestCard(props: TestCardProps) {
  const {
    test: { id, name, summary, imageUrl, questionsToAttempt },
  } = props

  const submit = useSubmit()

  function handleClick() {
    const formData = new FormData()
    formData.set('testId', id)

    submit(formData, {
      method: 'post',
    })
  }

  console.log(imageUrl)

  return (
    <div className='flex flex-col gap-3 rounded-md p-2 outline outline-black/10 sm:w-80 sm:p-3'>
      <div className='flex items-center justify-between'>
        <p className='font-medium capitalize sm:text-xl'>{name}</p>

        <img
          className='w-8 sm:w-10'
          src='https://drive.google.com/uc?id=1B-EJP3b4fzTc8ZQuIHDY_Z0F7uCyRUi9'
          alt='test-logo'
        />
      </div>

      <p className='text-sm sm:text-base'>{summary}</p>

      <div className='flex justify-between text-xs text-gray-600 sm:text-sm'>
        <p className='flex items-center gap-1'>
          <TbNotes />
          {questionsToAttempt} questions
        </p>
        <p className='flex items-center gap-1'>
          <SlChemistry />
          {69} attempts
        </p>
      </div>

      <Button onClick={handleClick} className='self-end'>try now</Button>
    </div>
  )
}
