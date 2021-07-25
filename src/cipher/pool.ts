import type { AtIndexProperty } from '../utilities/atIndex'
import type { CipherParams } from './Cipher'
import type { ForEachProperty } from '../utilities/forEach'
import type { SwapIndicesProperty } from '../utilities/swapIndices'
import atIndexUtil from '../utilities/atIndex'
import forEachUtil from '../utilities/forEach'
import swapIndicesUtil from '../utilities/swapIndices'

type PoolState = CipherParams['state']['pool']

export interface Pool
  extends AtIndexProperty,
    ForEachProperty,
    SwapIndicesProperty {
  create: (state: PoolState) => Pool
  state: PoolState
}

export default function pool(state: PoolState): Pool {
  const atIndex: Pool['atIndex'] = atIndexUtil(state),
    forEach: Pool['forEach'] = forEachUtil(state),
    swapIndices: Pool['swapIndices'] = swapIndicesUtil(state)

  function create(newState: PoolState): Pool {
    return pool(newState)
  }

  return { atIndex, create, forEach, state, swapIndices }
}
