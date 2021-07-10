import type { AtIndexProperty } from '../utilities/atIndex'
import type { ForEachProperty } from '../utilities/forEach'
import type { SwapIndicesProperty } from '../utilities/swapIndices'
import atIndexUtil from '../utilities/atIndex'
import forEachUtil from '../utilities/forEach'
import identityPermutation from '../utilities/identityPermutation'
import swapIndicesUtil from '../utilities/swapIndices'

export interface PoolInput {
  state?: number[]
  width: number
}

export interface Pool
  extends AtIndexProperty,
    ForEachProperty,
    SwapIndicesProperty {
  create: (state: number[]) => Pool
  state: number[]
}

export default function pool({
  width,
  state = identityPermutation(width),
}: PoolInput): Pool {
  const atIndex: Pool['atIndex'] = atIndexUtil(state),
    forEach: Pool['forEach'] = forEachUtil(state),
    swapIndices: Pool['swapIndices'] = swapIndicesUtil(state)

  function create(state: Pool['state']): Pool {
    return pool({ state, width })
  }

  return { atIndex, create, forEach, state, swapIndices }
}
