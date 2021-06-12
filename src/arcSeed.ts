import keySchedule from './keySchedule'
import poolModule, { PoolInput } from './pool'
import { RoundKeyInput } from './roundKey'
import identityPermutation from './utilities/identityPermutation'

interface ArcSeedState {
  i: number
  pool: PoolInput['state']
  roundKey: RoundKeyInput['state']
}

interface KeyStream {
  key: number[]
  state: ArcSeedState
}

interface ArcSeedInput {
  seed: string
  state?: ArcSeedState
  width?: number
}

export interface ArcSeed extends ArcSeedInput {
  keyStream: (width: number) => KeyStream
}

export default function arcSeed({
  seed,
  state: { i, roundKey, pool: prevPoolState } = {
    i: 0,
    pool: null,
    roundKey: 0,
  },
  width = 256,
}: ArcSeedInput): ArcSeed {
  const pool = prevPoolState
    ? poolModule({ width, state: prevPoolState })
    : keySchedule({ seed, width })

  function keyStream(width: number): KeyStream {
    return { key: identityPermutation(width), state: undefined }
  }

  return {
    keyStream,
    seed,
    state: { i, roundKey, pool: pool.state },
  }
}
