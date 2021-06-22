import isStrictZero from './utilities/isStrictZero'
import keySchedule from './keySchedule'
import length from './utilities/length'
import poolModule, { Pool, PoolInput } from './pool'
import remainder, { RemainderCallback } from './utilities/remainder'
import roundKeyModule, { RoundKey, RoundKeyInput } from './roundKey'

const defaultDrop = 3072,
  poolWidth = 256

interface ArcSeedState {
  i: number
  pool: PoolInput['state']
  roundKey: RoundKeyInput['state']
}

interface ArcSeedInput {
  drop?: number
  seed: string
  state?: ArcSeedState
}

export type NumbersArcSeedTuple = [number[], ArcSeed]

export interface ArcSeed extends ArcSeedInput {
  create: (state: ArcSeedState) => ArcSeed
  interval: (count: number) => NumbersArcSeedTuple
  keyStream: (count: number) => NumbersArcSeedTuple
  state: ArcSeedState
}

export default function arcSeed({
  seed,
  drop: prevDrop = defaultDrop,
  state: { i: prevI, roundKey: prevRoundKeyState, pool: prevPoolState } = {
    i: 0,
    pool: undefined,
    roundKey: 0,
  },
}: ArcSeedInput): ArcSeed {
  const drop: number = 0,
    isNonZeroDrop: boolean = !isStrictZero(prevDrop),
    remainderWidth: RemainderCallback = remainder(poolWidth),
    prevPool: Pool = prevPoolState
      ? poolModule({ state: prevPoolState, width: poolWidth })
      : keySchedule({ seed, width: poolWidth })

  function create(state: ArcSeedState): ArcSeed {
    return arcSeed({
      drop,
      seed,
      state,
    })
  }

  function interval(count: number): NumbersArcSeedTuple {
    let result: NumbersArcSeedTuple[0] = [],
      next: NumbersArcSeedTuple[1] = create({
        i: prevI,
        pool: prevPool.state,
        roundKey: prevRoundKeyState,
      }),
      keyStreamLocal = keyStream

    while (length(result) < count) {
      const [key, nextArcSeed]: NumbersArcSeedTuple = keyStreamLocal(7),
        fiftyTwoBitBinary: string = key
          .map((k: number) => k.toString(2).padStart(8, '0'))
          .join('')
          .slice(4),
        fiftyTwoBitBinaryLength: number = length(fiftyTwoBitBinary),
        fiftyTwoBitDecimal: number = parseInt(fiftyTwoBitBinary, 2),
        generatedInterval: number =
          fiftyTwoBitDecimal * 2 ** -fiftyTwoBitBinaryLength

      result = [...result, generatedInterval]
      next = nextArcSeed
      keyStreamLocal = nextArcSeed.keyStream
    }

    return [result, next]
  }

  function keyStream(count: number): NumbersArcSeedTuple {
    let i: number = prevI,
      roundKey: RoundKey = roundKeyModule({
        state: prevRoundKeyState,
        width: poolWidth,
      }),
      pool: Pool = prevPool.create(prevPool.state),
      key: number[] = []

    while (length(key) < count) {
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

    return [
      key,
      create({
        i,
        pool: pool.state,
        roundKey: roundKey.state,
      }),
    ]
  }

  return isNonZeroDrop
    ? keyStream(prevDrop)[1]
    : {
        create,
        drop,
        interval,
        keyStream,
        seed,
        state: {
          i: prevI,
          pool: prevPool.state,
          roundKey: prevRoundKeyState,
        },
      }
}
