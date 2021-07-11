import type NumberTransform from '../utilities/NumberTransform'
import type { RemainderCallback } from '../utilities/remainder'
import type { SliceAtCallback } from '../utilities/sliceAt'
import type { Cipher, CipherInput, Pool, RoundKey } from '../cipher'
import ceiling from '../utilities/ceiling'
import length from '../utilities/length'
import negate from '../utilities/negate'
import remainder from '../utilities/remainder'
import sliceAt from '../utilities/sliceAt'
import {
  keySchedule,
  pool as cipherPool,
  roundKey as cipherRoundKey,
} from '../cipher'
import { poolWidth } from '../data'

export default function octet({
  count,
  drop,
  seed,
  max: prevMax,
  min: prevMin,
  state: { i: prevI, roundKey: prevRoundKeyState, pool: prevPoolState },
}: CipherInput): Cipher {
  const max: number = ceiling(prevMax),
    min: number = ceiling(prevMin),
    addMin: NumberTransform = (n: number) => n + min,
    subtractMin: NumberTransform = (n: number) => n + negate(min),
    toGenerate: number = count + drop,
    discardNonrandom: SliceAtCallback = sliceAt(drop),
    prevPool: Pool = prevPoolState
      ? cipherPool({ state: prevPoolState, width: poolWidth })
      : keySchedule({ seed, width: poolWidth }),
    rangeDiff: number = subtractMin(max),
    remainderRangeDiff: RemainderCallback = remainder(rangeDiff),
    remainderWidth: RemainderCallback = remainder(poolWidth)

  let i: number = prevI,
    roundKey: RoundKey = cipherRoundKey({
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

  const state: Cipher['state'] = {
    i,
    pool: pool.state,
    roundKey: roundKey.state,
  }

  function next(nextCount = 1): Cipher {
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
