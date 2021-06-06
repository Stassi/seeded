import { Key } from './key'
import { Pool } from './pool'
import { SwapPointer } from './swapPointer'

interface KeySchedulerInput {
  key: Key
  pool: Pool
  roundKey: SwapPointer
}

export default function keyScheduler({
  key,
  pool,
  roundKey,
}: KeySchedulerInput): KeySchedulerInput['pool'] {
  pool.forEach((i: number): void => {
    roundKey = roundKey.create(roundKey.addTo(key.atIndex(i), pool.atIndex(i)))
    pool = pool.create(pool.swapIndices(i, roundKey.state))
  })

  return pool
}
