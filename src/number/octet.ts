import type { Cipher, CipherParams } from '../cipher'
import type {
  N,
  Ns,
  NumberCallback,
  NumbersCallback,
} from '../utilities/numbers'
import ceiling from '../utilities/ceiling'
import length from '../utilities/length'
import { poolWidth } from '../data'
import sliceAt from '../utilities/sliceAt'
import { add, addTo, increment, negate, remainder } from '../arithmetic'
import { pool as poolModule, roundKey as roundKeyModule } from '../cipher'

type Pool = ReturnType<typeof poolModule>
type RoundKey = ReturnType<typeof roundKeyModule>

export default function octet({
  count,
  drop,
  max: prevMax,
  min: prevMin,
  state: { i: prevI, roundKey: prevRoundKeyState, pool: prevPoolState },
}: CipherParams): Cipher {
  const max: N = ceiling(prevMax),
    min: N = ceiling(prevMin),
    toGenerate: N = add(count, drop),
    prevPool: Pool = poolModule(prevPoolState),
    dropInitial = <NumbersCallback>sliceAt(drop),
    addToMin: NumberCallback = addTo(min),
    remainderPoolWidth: NumberCallback = remainder(poolWidth),
    remainderRangeDiff: NumberCallback = remainder(add(max, negate(min)))

  let i: N = prevI,
    innerGenerated: Ns = [],
    roundKey: RoundKey = roundKeyModule(prevRoundKeyState),
    pool: Pool = prevPool.create(prevPool.state)

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

  return {
    generated: dropInitial(innerGenerated),
    state: {
      i,
      pool: pool.state,
      roundKey: roundKey.state,
    },
  }
}
