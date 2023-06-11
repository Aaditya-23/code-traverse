import { twMerge } from 'tailwind-merge'

export default function Input(props: React.HTMLProps<HTMLInputElement>) {
  const { className, ...restProps } = props
  const css = twMerge(
    'rounded-md outline outline-black/10 py-1 px-2',
    className
  )

  return <input {...restProps} className={css} />
}
