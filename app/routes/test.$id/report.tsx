import { Dialog } from '@headlessui/react'
import { useState } from 'react'
import { GoBug } from 'react-icons/go'
import { Button } from '~/components'

export default function Report() {
  const [isOpen, setIsOpen] = useState(false)

  function handleModal(state: boolean) {
    setIsOpen(state)
  }

  return (
    <>
      <Button
        type='button'
        className='flex items-center gap-2 border-2 bg-white py-1 normal-case text-gray-600 outline-gray-600'
        onClick={() => handleModal(true)}
      >
        <GoBug size='1.5em' />
        Report question/bug
      </Button>

      <Dialog onClose={() => handleModal(false)} open={isOpen}>
        <Dialog.Panel>
          <Dialog.Title>report</Dialog.Title>
        </Dialog.Panel>
      </Dialog>
    </>
  )
}
