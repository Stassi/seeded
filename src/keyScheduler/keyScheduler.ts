import atIndex from '../utilities/atIndex'
import identityPermutation, { Pool } from '../utilities/identityPermutation'
import length from '../utilities/length'
import remainder from '../utilities/remainder'
import swapPointer, { SwapPointer } from './swapPointer'

interface KeySchedulerInput {
  key: number[]
  poolWidth: number
}

export default function keyScheduler({
  key,
  poolWidth,
}: KeySchedulerInput): Pool {
  let j: SwapPointer = swapPointer({ width: poolWidth })
  let pool: Pool = identityPermutation(poolWidth)
  const poolOriginal: Pool = [...pool]
  const remainderKeyLength = remainder(length(key))
  const atKeyIndex = atIndex(key)
  const atPoolIndex = atIndex(pool)

  poolOriginal.forEach((i: number): void => {
    j = j.create(j.addTo(atKeyIndex(remainderKeyLength(i)), atPoolIndex(i)))
    pool[j.state] = i
    pool[i] = j.state
  })

  return pool
}
