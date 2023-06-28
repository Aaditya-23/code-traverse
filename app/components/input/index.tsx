import { twMerge } from 'tailwind-merge'

export default function Input(props: React.HTMLProps<HTMLInputElement>) {
  const { className, ...restProps } = props

  return (
    <input
      {...restProps}
      className={twMerge(
        'rounded-md px-2 py-1 outline outline-2 outline-black/10 focus:outline-blue-500 sm:text-lg',
        className
      )}
    />
  )
}
