import { add } from '../arithmetic'
import identityPermutation from '../utilities/identityPermutation'
import keyModule from './key'
import poolModule from './pool'
import { poolWidth } from '../data'
import roundKeyModule from './roundKey'

type Key = ReturnType<typeof keyModule>
type Pool = ReturnType<typeof poolModule>
type RoundKey = ReturnType<typeof roundKeyModule>
type Seed = Parameters<typeof keyModule>[0]

export default function keySchedule(seed: Seed): Pool {
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
