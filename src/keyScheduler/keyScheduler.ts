import atIndex from '../utilities/atIndex'
import length from '../utilities/length'
import pool, { Pool } from './pool'
import remainder from '../utilities/remainder'
import swapPointer, { SwapPointer } from './swapPointer'

interface KeySchedulerInput {
  key: number[]
  poolWidth: number
}

export default function keyScheduler({
  key,
  poolWidth,
}: KeySchedulerInput): number[] {
  let j: SwapPointer = swapPointer({ width: poolWidth })
  let s: Pool = pool({ poolWidth })

  const remainderKeyLength = remainder(length(key))
  const atKeyIndex = atIndex(key)

  s.clone().forEach((i: number): void => {
    j = j.create(j.addTo(atKeyIndex(remainderKeyLength(i)), s.atIndex(i)))
    s.state[j.state] = i
    s.state[i] = j.state
  })

  return s.state
}
