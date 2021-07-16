import type NumberTransform from '../utilities/NumberTransform'
import type { RemainderCallback } from '../utilities/remainder'
import type { SliceAtCallback } from '../utilities/sliceAt'
import type { CipherComponent, CipherParams, Pool, RoundKey } from '../cipher'
import ceiling from '../utilities/ceiling'
import length from '../utilities/length'
import negate from '../utilities/negate'
import remainder from '../utilities/remainder'
import sliceAt from '../utilities/sliceAt'
import { pool as poolModule, roundKey as roundKeyModule } from '../cipher'
import { poolWidth } from '../data'

export default function octet({
  count,
  drop,
  max: prevMax,
  min: prevMin,
  state: { i: prevI, roundKey: prevRoundKeyState, pool: prevPoolState },
}: CipherParams): CipherComponent {
  const max: number = ceiling(prevMax),
    min: number = ceiling(prevMin),
    addMin: NumberTransform = (n: number) => n + min,
    subtractMin: NumberTransform = (n: number) => n + negate(min),
    toGenerate: number = count + drop,
    dropInitial: SliceAtCallback = sliceAt(drop),
    prevPool: Pool = poolModule(prevPoolState),
    rangeDiff: number = subtractMin(max),
    remainderRangeDiff: RemainderCallback = remainder(rangeDiff),
    remainderWidth: RemainderCallback = remainder(poolWidth)

  let i: number = prevI,
    roundKey: RoundKey = roundKeyModule(prevRoundKeyState),
    pool: Pool = prevPool.create(prevPool.state),
    innerGenerated: CipherComponent['generated'] = []

  while (length(innerGenerated) < toGenerate) {
    i = remainderWidth(i + 1)
    roundKey = roundKey.create(roundKey.addTo(pool.atIndex(i)))
    pool = pool.create(pool.swapIndices(i, roundKey.state))
    innerGenerated = [
      ...innerGenerated,
      addMin(
        remainderRangeDiff(
          pool.atIndex(
            remainderWidth(pool.atIndex(i) + pool.atIndex(roundKey.state))
          )
        )
      ),
    ]
  }

  const generated: CipherComponent['generated'] = dropInitial(innerGenerated),
    state: CipherComponent['state'] = {
      i,
      pool: pool.state,
      roundKey: roundKey.state,
    }

  return {
    generated,
    state,
  }
}
