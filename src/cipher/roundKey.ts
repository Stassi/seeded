import type { RemainderCallback } from '../utilities/remainder'
import remainder from '../utilities/remainder'
import sum from '../utilities/sum'
import { poolWidth } from '../data'

export type RoundKeyState = number

export interface RoundKey {
  addTo: (...summands: number[]) => number
  create: (state: RoundKeyState) => RoundKey
  state: RoundKeyState
}

export default function roundKey(state: RoundKeyState): RoundKey {
  const remainderWidth: RemainderCallback = remainder(poolWidth)

  function addTo(...summands: number[]): number {
    return sum(state, ...summands)
  }

  function create(newState: RoundKeyState): RoundKey {
    return roundKey(remainderWidth(newState))
  }

  return { addTo, create, state }
}
