import type { RemainderCallback } from '../utilities/remainder'
import remainder from '../utilities/remainder'
import sum from '../utilities/sum'

export interface RoundKeyInput {
  state?: number
  width: number
}

export interface RoundKey {
  addTo: (...summands: number[]) => number
  create: (n: number) => RoundKey
  state: number
}

export default function roundKey({
  width,
  state = 0,
}: RoundKeyInput): RoundKey {
  const remainderWidth: RemainderCallback = remainder(width)

  function addTo(...summands: number[]): number {
    return sum(state, ...summands)
  }

  function create(n: RoundKey['state']): RoundKey {
    return roundKey({ width, state: remainderWidth(n) })
  }

  return { addTo, create, state }
}
