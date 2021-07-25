import type { Pool } from './Cipher'
import atIndexUtil from '../utilities/atIndex'
import forEachUtil from '../utilities/forEach'
import swapIndicesUtil from '../utilities/swapIndices'

type PoolState = Pool['state']

export default function pool(state: PoolState): Pool {
  const atIndex: Pool['atIndex'] = atIndexUtil(state),
    forEach: Pool['forEach'] = forEachUtil(state),
    swapIndices: Pool['swapIndices'] = swapIndicesUtil(state)

  function create(newState: PoolState): Pool {
    return pool(newState)
  }

  return { atIndex, create, forEach, state, swapIndices }
}
