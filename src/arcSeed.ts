import keyScheduler from './keyScheduler/keyScheduler'
import { KeyStream } from './utilities/identityPermutation'

export default function arcSeed(): any {
  const keyScheduled: KeyStream = keyScheduler({
    key: [1, 2, 3, 4, 5, 6, 7, 8],
    keyStreamWidth: 256,
  })

  console.log({ keyScheduled })

  return keyScheduled
}
