import type { AtIndexProperty } from '../utilities/atIndex'
import type { ForEachProperty } from '../utilities/forEach'
import type { RecursiveState } from '../utilities/state'
import type { SwapIndicesProperty } from '../utilities/swapIndices'
import type { N, Ns } from '../utilities/numbers'
import atIndexUtil from '../utilities/atIndex'
import forEachUtil from '../utilities/forEach'
import swapIndicesUtil from '../utilities/swapIndices'

interface Pool
  extends AtIndexProperty<N>,
    ForEachProperty,
    SwapIndicesProperty<N>,
    RecursiveState<Pool, Ns> {}

type PoolState = Pool['state']

export default function pool(state: PoolState): Pool {
  return {
    state,
    atIndex: atIndexUtil(state),
    create: pool,
    forEach: forEachUtil(state),
    swapIndices: swapIndicesUtil(state),
  }
}
