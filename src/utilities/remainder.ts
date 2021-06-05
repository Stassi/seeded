export default function remainder(
  divisor: number
): (dividend: number) => number {
  return (dividend: number): number => dividend % divisor
}
