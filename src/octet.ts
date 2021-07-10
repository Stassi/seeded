import type { RemainderCallback } from './utilities/remainder'
import type { SliceAtCallback } from './utilities/sliceAt'
import type { Cipher, CipherInput, Pool, RoundKey } from './cipher'
import ceiling from './utilities/ceiling'
import length from './utilities/length'
import negate from './utilities/negate'
import remainder from './utilities/remainder'
import sliceAt from './utilities/sliceAt'
import timeSinceEpoch from './utilities/timeSinceEpoch'
import {
  keySchedule,
  pool as cipherPool,
  roundKey as cipherRoundKey,
} from './cipher'
import { defaultDrop, poolWidth } from './integers.json'

const rangeOverflowErrorMsg: string = '(max - min) must not exceed 256',
  rangeUnderflowErrorMsg: string = 'max ceiling must exceed min ceiling'
export { rangeOverflowErrorMsg, rangeUnderflowErrorMsg }

type NumberTransform = (n: number) => number

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
}: CipherInput = {}): Cipher {
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
    rangeOverflow: boolean = rangeDiff > poolWidth,
    rangeUnderflow: boolean = min >= max,
    remainderRangeDiff: RemainderCallback = remainder(rangeDiff),
    remainderWidth: RemainderCallback = remainder(poolWidth)

  if (rangeOverflow) throw new RangeError(rangeOverflowErrorMsg)
  if (rangeUnderflow) throw new RangeError(rangeUnderflowErrorMsg)

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
