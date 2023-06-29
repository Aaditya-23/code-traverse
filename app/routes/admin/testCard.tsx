import { type Test } from '~/db/schema.server'

export default function TestCard(props: Omit<Test, 'createdAt'>) {
  return <div></div>
}
