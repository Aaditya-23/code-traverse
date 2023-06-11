import { useSubmit } from '@remix-run/react'
import type { Test } from '~/db/schema.server'
import Button from '../button'

type TestCardProps = {
  test: Pick<Test, 'id' | 'name' | 'imageUrl' | 'summary'>
}

export default function TestCard(props: TestCardProps) {
  const {
    test: { id, name, summary },
  } = props

  const submit = useSubmit()

  function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const formData = new FormData()
    formData.set('testId', id)

    submit(formData, {
      method: 'post',
    })
  }

  return (
    <div className='flex flex-col gap-2 rounded-lg p-3 shadow-lg outline outline-black/10 md:w-96'>
      <span className='text-lg font-bold uppercase'>{name}</span>

      <span className='text-justify text-sm first-letter:capitalize'>
        {summary}
      </span>

      <Button onClick={handleClick} className='self-start'>
        try now
      </Button>
    </div>
  )
}
