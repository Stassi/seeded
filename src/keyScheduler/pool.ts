import atIndexUtil from '../utilities/atIndex'
import identityPermutation from '../utilities/identityPermutation'

interface PoolInput {
  poolWidth: number
  state?: number[]
}

type ForEachCallback = (value: number, index: number, array: number[]) => void

export interface Pool extends PoolInput {
  atIndex: (n: number) => any
  create: (s: number[]) => Pool
  forEach: (fn: ForEachCallback) => void
  swapIndices: (i: number, j: number) => number[]
}

export default function pool({
  poolWidth,
  state = identityPermutation(poolWidth),
}: PoolInput): Pool {
  function atIndex(n: number): any {
    return atIndexUtil(state)(n)
  }

  function create(s: number[]): Pool {
    return pool({ poolWidth, state: s })
  }

  function forEach(fn: ForEachCallback): void {
    return state.forEach(fn)
  }

  function swapIndices(i: number, j: number): number[] {
    const newState: number[] = [...state],
      prevI: number = atIndex(i)
    newState[i] = atIndex(j)
    newState[j] = prevI
    return newState
  }

  return { atIndex, create, forEach, poolWidth, state, swapIndices }
}
