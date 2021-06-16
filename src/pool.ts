import atIndexUtil, { AtIndexProperty } from './utilities/atIndex'
import forEachUtil, { ForEachProperty } from './utilities/forEach'
import identityPermutation from './utilities/identityPermutation'
import swapIndicesUtil, { SwapIndicesProperty } from './utilities/swapIndices'

export interface PoolInput {
  state?: number[]
  width: number
}

export interface Pool
  extends AtIndexProperty,
    ForEachProperty,
    PoolInput,
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

  return { atIndex, create, forEach, state, swapIndices, width }
}
