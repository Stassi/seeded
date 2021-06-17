export type RemainderCallback = (dividend: number) => number

export default function remainder(divisor: number): RemainderCallback {
  return (dividend: number): number => dividend % divisor
}
