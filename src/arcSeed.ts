import keySchedule from './keySchedule'
import { Pool } from './pool'

interface ArcSeedInput {
  seed: string
  width?: number
}

export default function arcSeed({ seed, width = 256 }: ArcSeedInput) {
  let pool: Pool = keySchedule({ seed, width })

  console.log(pool.state)

  return pool.state
}
