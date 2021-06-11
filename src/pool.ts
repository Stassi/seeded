import atIndexUtil, { AtIndexProperty } from './utilities/atIndex'
import forEachUtil, { ForEachProperty } from './utilities/forEach'
import identityPermutation from './utilities/identityPermutation'
import swapIndicesUtil, { SwapIndicesProperty } from './utilities/swapIndices'

interface PoolInput {
  state?: number[]
  width: number
}

export interface Pool
  extends AtIndexProperty,
    ForEachProperty,
    PoolInput,
    SwapIndicesProperty {
  create: (s: number[]) => Pool
}

export default function pool({ width, state: stateArg }: PoolInput): Pool {
  const state: PoolInput['state'] = stateArg || identityPermutation(width),
    atIndex: Pool['atIndex'] = atIndexUtil(state),
    forEach: Pool['forEach'] = forEachUtil(state),
    swapIndices: Pool['swapIndices'] = swapIndicesUtil(state)

  function create(state: PoolInput['state']): Pool {
    return pool({ state, width })
  }

  return { atIndex, create, forEach, state, swapIndices, width }
}
