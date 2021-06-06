import atIndex from '../utilities/atIndex'
import length from '../utilities/length'
import pool, { Pool } from './pool'
import remainder from '../utilities/remainder'
import swapPointer, { SwapPointer } from './swapPointer'

interface KeySchedulerInput {
  key: number[]
  width: number
}

export default function keyScheduler({
  key,
  width,
}: KeySchedulerInput): number[] {
  let j: SwapPointer = swapPointer({ width })
  let s: Pool = pool({ width })

  const remainderKeyLength = remainder(length(key))
  const atKeyIndex = atIndex(key)

  s.forEach((i: number): void => {
    j = j.create(j.addTo(atKeyIndex(remainderKeyLength(i)), s.atIndex(i)))
    s = s.create(s.swapIndices(i, j.state))
  })

  return s.state
}
