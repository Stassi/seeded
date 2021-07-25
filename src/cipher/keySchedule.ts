import type { Key, Pool, RoundKey } from './Cipher'
import { add } from '../arithmetic'
import identityPermutation from '../utilities/identityPermutation'
import keyModule from './key'
import poolModule from './pool'
import { poolWidth } from '../data'
import roundKeyModule from './roundKey'

export default function keySchedule(seed: string): Pool {
  const { atIndex: atKeyIndex }: Key = keyModule(seed)

  let pool: Pool = poolModule(identityPermutation(poolWidth)),
    roundKey: RoundKey = roundKeyModule(0)

  pool.forEach((i: number): void => {
    roundKey = roundKey.create(
      roundKey.addTo(add(atKeyIndex(i), pool.atIndex(i)))
    )
    pool = pool.create(pool.swapIndices(i, roundKey.state))
  })

  return pool
}
