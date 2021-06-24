import negate from './negate'

export type BinaryNumberToIntervalCallback = (n: number) => number

export default function binaryNumberToInterval(
  bits: number
): BinaryNumberToIntervalCallback {
  return (n: number) => n * 2 ** negate(bits)
}
