import { useNavigate, useParams } from '@remix-run/react'
import { Button } from '~/components'

export default function IncompleteTest() {
  const navigate = useNavigate()
  const { id } = useParams()

  return (
    <main className='mx-auto w-max p-2'>
      <h1 className='text-xl font-semibold capitalize'>
        you need to complete this test before you can view the results
      </h1>

      <Button onClick={() => navigate(`/test/${id}`)}>complete test</Button>
    </main>
  )
}
