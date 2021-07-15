import type { RemainderCallback } from '../utilities/remainder'
import remainder from '../utilities/remainder'
import sum from '../utilities/sum'
import { poolWidth } from '../data'

export type RoundKeyInput = number

export interface RoundKey {
  addTo: (...summands: number[]) => number
  create: (n: number) => RoundKey
  state: number
}

export default function roundKey(state: RoundKeyInput): RoundKey {
  const remainderWidth: RemainderCallback = remainder(poolWidth)

  function addTo(...summands: number[]): number {
    return sum(state, ...summands)
  }

  function create(n: RoundKey['state']): RoundKey {
    return roundKey(remainderWidth(n))
  }

  return { addTo, create, state }
}
