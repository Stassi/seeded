import type { Key } from './key'
import type { RoundKey } from './roundKey'
import type { Pool } from './pool'
import identityPermutation from '../utilities/identityPermutation'
import keyModule from './key'
import poolModule from './pool'
import roundKeyModule from './roundKey'
import { poolWidth } from '../data'

export default function keySchedule(seed: string): Pool {
  const { atIndex: atKeyIndex }: Key = keyModule(seed)
  let pool: Pool = poolModule(identityPermutation(poolWidth)),
    roundKey: RoundKey = roundKeyModule(0)

  pool.forEach((i: number): void => {
    roundKey = roundKey.create(roundKey.addTo(atKeyIndex(i) + pool.atIndex(i)))
    pool = pool.create(pool.swapIndices(i, roundKey.state))
  })

  return pool
}
