import { Key } from './key'
import { Pool } from './pool'
import { RoundKey } from './roundKey'

interface KeySchedulerInput {
  key: Key
  pool: Pool
  roundKey: RoundKey
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
