import key from './keyScheduler/key'
import keyScheduler from './keyScheduler/keyScheduler'
import pool from './keyScheduler/pool'
import roundKey from './keyScheduler/roundKey'

interface ArcSeedInput {
  seed: string
  width?: number
}

export default function arcSeed({ seed, width = 256 }: ArcSeedInput) {
  const keyScheduled = keyScheduler({
    key: key(seed),
    pool: pool({ width }),
    roundKey: roundKey({ width }),
  })

  console.log(keyScheduled.state)

  return keyScheduled.state
}
