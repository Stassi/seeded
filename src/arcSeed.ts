import keySchedule from './keySchedule'
import length from './utilities/length'
import poolModule, { Pool, PoolInput } from './pool'
import remainder, { RemainderCallback } from './utilities/remainder'
import roundKeyModule, { RoundKey, RoundKeyInput } from './roundKey'

interface ArcSeedState {
  i: number
  pool: PoolInput['state']
  roundKey: RoundKeyInput['state']
}

interface ArcSeedInput {
  seed: string
  state?: ArcSeedState
  width?: number
}

export interface KeyStream {
  key: number[]
  next: ArcSeed
}

export interface ArcSeed extends ArcSeedInput {
  create: (state: ArcSeedState) => ArcSeed
  keyStream: (keyWidth: number) => KeyStream
  state: ArcSeedState
}

export default function arcSeed({
  seed,
  state: { i: prevI, roundKey: prevRoundKeyState, pool: prevPoolState } = {
    i: 0,
    pool: undefined,
    roundKey: 0,
  },
  width = 256,
}: ArcSeedInput): ArcSeed {
  const remainderWidth: RemainderCallback = remainder(width),
    prevPool: Pool = prevPoolState
      ? poolModule({ width, state: prevPoolState })
      : keySchedule({ seed, width })

  function create(state: ArcSeedState): ArcSeed {
    return arcSeed({ seed, state, width })
  }

  function keyStream(keyWidth: number): KeyStream {
    let i: number = prevI,
      roundKey: RoundKey = roundKeyModule({ width, state: prevRoundKeyState }),
      pool: Pool = prevPool.create(prevPool.state),
      key: number[] = []

    while (length(key) < keyWidth) {
      i = remainderWidth(i + 1)
      roundKey = roundKey.create(roundKey.addTo(pool.atIndex(i)))
      pool = pool.create(pool.swapIndices(i, roundKey.state))
      key = [
        ...key,
        pool.atIndex(
          remainderWidth(pool.atIndex(i) + pool.atIndex(roundKey.state))
        ),
      ]
    }

    return {
      key,
      next: create({
        i,
        pool: pool.state,
        roundKey: roundKey.state,
      }),
    }
  }

  return {
    create,
    keyStream,
    seed,
    state: {
      i: prevI,
      pool: prevPool.state,
      roundKey: prevRoundKeyState,
    },
  }
}
