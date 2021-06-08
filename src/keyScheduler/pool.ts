import atIndexUtil from '../utilities/atIndex'
import identityPermutation from '../utilities/identityPermutation'
import forEachUtil, { ForEachCallback } from '../utilities/forEach'

interface PoolInput {
  state?: number[]
  width: number
}

export interface Pool extends PoolInput {
  atIndex: (n: number) => number
  create: (s: number[]) => Pool
  forEach: (fn: ForEachCallback) => void
  swapIndices: (i: number, j: number) => number[]
}

export default function pool({
  width,
  state = identityPermutation(width),
}: PoolInput): Pool {
  const atIndex: Pool['atIndex'] = atIndexUtil(state),
    forEach: Pool['forEach'] = forEachUtil(state)

  function create(s: PoolInput['state']): Pool {
    return pool({ width, state: s })
  }

  function swapIndices(i: number, j: number): number[] {
    const s: number[] = [...state],
      prevI: number = atIndex(i)
    s[i] = atIndex(j)
    s[j] = prevI
    return s
  }

  return { atIndex, create, forEach, state, swapIndices, width }
}
