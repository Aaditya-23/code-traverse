import { twMerge } from 'tailwind-merge'

export default function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  const { className, ...restProps } = props

  const css = twMerge(
    'rounded-md bg-blue-500 p-2 text-xs font-bold uppercase tracking-wider text-white outline-8 outline-offset-2 outline-blue-500 disabled:bg-blue-300',
    className
  )

  return <button {...restProps} className={css}></button>
}
