import type { Pool, PoolInput } from './pool'
import type { RemainderCallback } from '../utilities/remainder'
import type { RoundKey, RoundKeyInput } from './roundKey'
import type { SliceAtCallback } from '../utilities/sliceAt'
import ceiling from '../utilities/ceiling'
import keySchedule from './keySchedule'
import length from '../utilities/length'
import negate from '../utilities/negate'
import poolModule from './pool'
import remainder from '../utilities/remainder'
import roundKeyModule from './roundKey'
import sliceAt from '../utilities/sliceAt'
import timeSinceEpoch from '../utilities/timeSinceEpoch'
import { defaultDrop, poolWidth } from '../integers.json'

interface OctetState {
  i: number
  pool: PoolInput['state']
  roundKey: RoundKeyInput['state']
}

export interface OctetInput {
  count?: number
  drop?: number
  max?: number
  min?: number
  seed?: string
  state?: OctetState
}

type NumberTransform = (n: number) => number

export interface Octet {
  generated: number[]
  next: (count?: number) => Octet
  state: OctetState
}

export default function octet({
  count = 1,
  drop = defaultDrop,
  max: prevMax = poolWidth,
  min: prevMin = 0,
  seed = `${timeSinceEpoch()}`,
  state: { i: prevI, roundKey: prevRoundKeyState, pool: prevPoolState } = {
    i: 0,
    pool: undefined,
    roundKey: 0,
  },
}: OctetInput = {}): Octet {
  const max: number = ceiling(prevMax),
    min: number = ceiling(prevMin),
    addMin: NumberTransform = (n: number) => n + min,
    subtractMin: NumberTransform = (n: number) => n + negate(min),
    toGenerate: number = count + drop,
    discardNonrandom: SliceAtCallback = sliceAt(drop),
    prevPool: Pool = prevPoolState
      ? poolModule({ state: prevPoolState, width: poolWidth })
      : keySchedule({ seed, width: poolWidth }),
    rangeDiff: number = subtractMin(max),
    remainderRangeDiff: RemainderCallback = remainder(rangeDiff),
    remainderWidth: RemainderCallback = remainder(poolWidth)

  let i: number = prevI,
    roundKey: RoundKey = roundKeyModule({
      state: prevRoundKeyState,
      width: poolWidth,
    }),
    pool: Pool = prevPool.create(prevPool.state),
    generated: number[] = []

  while (length(generated) < toGenerate) {
    i = remainderWidth(i + 1)
    roundKey = roundKey.create(roundKey.addTo(pool.atIndex(i)))
    pool = pool.create(pool.swapIndices(i, roundKey.state))
    generated = [
      ...generated,
      addMin(
        remainderRangeDiff(
          pool.atIndex(
            remainderWidth(pool.atIndex(i) + pool.atIndex(roundKey.state))
          )
        )
      ),
    ]
  }

  const state: OctetState = {
    i,
    pool: pool.state,
    roundKey: roundKey.state,
  }

  function next(nextCount = 1): Octet {
    return octet({
      max,
      min,
      seed,
      state,
      count: nextCount,
      drop: 0,
    })
  }

  return {
    next,
    state,
    generated: discardNonrandom(generated),
  }
}
