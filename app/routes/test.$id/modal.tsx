import { Dialog } from '@headlessui/react'
import { Button } from '~/components'
import { useSubmit } from '@remix-run/react'

type ModalProps = {
  isOpen: boolean
  closeModal(): void
}

export default function Modal({ closeModal, isOpen }: ModalProps) {
  const submit = useSubmit()

  function handleTestEnd() {
    closeModal()

    const formData = new FormData()
    formData.set('endTest', 'true')

    submit(formData, {
      method: 'POST',
    })
  }

  return (
    <Dialog
      open={isOpen}
      onClose={closeModal}
      className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
    >
      <Dialog.Panel className='space-y-4 rounded-lg bg-white p-3 shadow-md outline outline-black/10'>
        <Dialog.Title>Are you sure you want to end the test now?</Dialog.Title>

        <div className='space-x-4'>
          <Button
            onClick={handleTestEnd}
            className='bg-red-500 outline-red-500'
          >
            end
          </Button>
          <Button onClick={closeModal}>cancel</Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  )
}
