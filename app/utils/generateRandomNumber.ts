export function generateRandomNumber(from: number, to: number) {
  const range = to - from + 1
  const decimalNumber = Math.random() * range
  const roundedRandom = Math.floor(decimalNumber)
  const randomNumber = roundedRandom + from

  return randomNumber
}
