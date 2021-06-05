import keyScheduler from './keyScheduler/keyScheduler'
import { Pool } from './utilities/identityPermutation'

export default function arcSeed(): any {
  const keyScheduled: Pool = keyScheduler({
    key: [1, 2, 3, 4, 5, 6, 7, 8],
    poolWidth: 256,
  })

  console.log({ keyScheduled })

  return keyScheduled
}
