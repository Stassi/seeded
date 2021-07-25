import type { SliceAtCallback } from '../utilities/sliceAt'
import type { AddToCallback, RemainderCallback } from '../arithmetic'
import type { Cipher, CipherParams, Pool, RoundKey } from '../cipher'
import ceiling from '../utilities/ceiling'
import length from '../utilities/length'
import { poolWidth } from '../data'
import sliceAt from '../utilities/sliceAt'
import { add, addTo, increment, negate, remainder } from '../arithmetic'
import { pool as poolModule, roundKey as roundKeyModule } from '../cipher'

export default function octet({
  count,
  drop,
  max: prevMax,
  min: prevMin,
  state: { i: prevI, roundKey: prevRoundKeyState, pool: prevPoolState },
}: CipherParams): Cipher {
  const toGenerate: number = add(count, drop),
    max: number = ceiling(prevMax),
    min: number = ceiling(prevMin),
    dropInitial: SliceAtCallback = sliceAt(drop),
    prevPool: Pool = poolModule(prevPoolState),
    addToMin: AddToCallback = addTo(min),
    remainderRangeDiff: RemainderCallback = remainder(add(max, negate(min))),
    remainderPoolWidth: RemainderCallback = remainder(poolWidth)

  let i: number = prevI,
    roundKey: RoundKey = roundKeyModule(prevRoundKeyState),
    pool: Pool = prevPool.create(prevPool.state),
    innerGenerated: Cipher['generated'] = []

  while (length(innerGenerated) < toGenerate) {
    i = remainderPoolWidth(increment(i))
    roundKey = roundKey.create(roundKey.addTo(pool.atIndex(i)))
    pool = pool.create(pool.swapIndices(i, roundKey.state))
    innerGenerated = [
      ...innerGenerated,
      addToMin(
        remainderRangeDiff(
          pool.atIndex(
            remainderPoolWidth(
              add(pool.atIndex(i), pool.atIndex(roundKey.state))
            )
          )
        )
      ),
    ]
  }

  const generated: Cipher['generated'] = dropInitial(innerGenerated),
    state: Cipher['state'] = {
      i,
      pool: pool.state,
      roundKey: roundKey.state,
    }

  return { generated, state }
}
