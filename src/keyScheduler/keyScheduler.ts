import { Key } from './key'
import { Pool } from './pool'
import { RoundKey } from './roundKey'

interface KeySchedulerInput {
  key: Key
  pool: Pool
  roundKey: RoundKey
}

export default function keyScheduler({
  pool,
  roundKey,
  key: { atIndex: atKeyIndex },
}: KeySchedulerInput): KeySchedulerInput['pool'] {
  pool.forEach((i: number): void => {
    roundKey = roundKey.create(roundKey.addTo(atKeyIndex(i), pool.atIndex(i)))
    pool = pool.create(pool.swapIndices(i, roundKey.state))
  })

  return pool
}
