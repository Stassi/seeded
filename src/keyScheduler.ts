import keyModule, { Key } from './key'
import poolModule, { Pool } from './pool'
import roundKeyModule, { RoundKey } from './roundKey'

interface KeySchedulerInput {
  seed: string
  width: number
}

export default function keyScheduler({ seed, width }: KeySchedulerInput) {
  const { atIndex: atKeyIndex }: Key = keyModule(seed)
  let pool: Pool = poolModule({ width }),
    roundKey: RoundKey = roundKeyModule({ width })

  pool.forEach((i: number): void => {
    roundKey = roundKey.create(roundKey.addTo(atKeyIndex(i), pool.atIndex(i)))
    pool = pool.create(pool.swapIndices(i, roundKey.state))
  })

  return pool
}
