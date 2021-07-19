export type DivideByCallback = (numerator: number) => number

export default function divideBy(denominator: number): DivideByCallback {
  return (numerator: number) => numerator / denominator
}
