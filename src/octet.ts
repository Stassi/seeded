import type { Pool, PoolInput } from './pool'
import type { RemainderCallback } from './utilities/remainder'
import type { RoundKey, RoundKeyInput } from './roundKey'
import keySchedule from './keySchedule'
import length from './utilities/length'
import poolModule from './pool'
import remainder from './utilities/remainder'
import roundKeyModule from './roundKey'
import sliceAt, { SliceAtCallback } from './utilities/sliceAt'
import timeSinceEpoch from './utilities/timeSinceEpoch'
import { defaultDrop, poolWidth } from './integers.json'

interface OctetState {
  i: number
  pool: PoolInput['state']
  roundKey: RoundKeyInput['state']
}

export interface OctetInput {
  count?: number
  drop?: number
  seed?: string
  state?: OctetState
}

export interface Octet {
  generated: number[]
  next: (count?: number) => Octet
  state: OctetState
}

export default function octet({
  count = 1,
  drop = defaultDrop,
  seed = `${timeSinceEpoch()}`,
  state: { i: prevI, roundKey: prevRoundKeyState, pool: prevPoolState } = {
    i: 0,
    pool: undefined,
    roundKey: 0,
  },
}: OctetInput = {}): Octet {
  const toGenerate = count + drop,
    discardNonrandom: SliceAtCallback = sliceAt(drop),
    prevPool: Pool = prevPoolState
      ? poolModule({ state: prevPoolState, width: poolWidth })
      : keySchedule({ seed, width: poolWidth }),
    remainderWidth: RemainderCallback = remainder(poolWidth)

  let i: number = prevI,
    pool: Pool = prevPool.create(prevPool.state),
    roundKey: RoundKey = roundKeyModule({
      state: prevRoundKeyState,
      width: poolWidth,
    }),
    generated: number[] = []

  while (length(generated) < toGenerate) {
    i = remainderWidth(i + 1)
    roundKey = roundKey.create(roundKey.addTo(pool.atIndex(i)))
    pool = pool.create(pool.swapIndices(i, roundKey.state))
    generated = [
      ...generated,
      pool.atIndex(
        remainderWidth(pool.atIndex(i) + pool.atIndex(roundKey.state))
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
