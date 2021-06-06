import atIndexUtil from '../utilities/atIndex'
import identityPermutation from '../utilities/identityPermutation'

interface PoolInput {
  poolWidth: number
  state?: number[]
}

type ForEachCallback = (value: number, index: number, array: number[]) => void

export interface Pool extends PoolInput {
  atIndex: (n: number) => any
  forEach: (fn: ForEachCallback) => void
  swapIndices: (i: number, j: number) => Pool
}

export default function pool({
  poolWidth,
  state = identityPermutation(poolWidth),
}: PoolInput): Pool {
  function atIndex(n: number): any {
    return atIndexUtil(state)(n)
  }

  function forEach(fn: ForEachCallback): void {
    return state.forEach(fn)
  }

  function swapIndices(i: number, j: number): Pool {
    const newState: number[] = [...state],
      prevI: number = atIndex(i)
    newState[i] = atIndex(j)
    newState[j] = prevI
    return pool({ poolWidth, state: newState })
  }

  return { atIndex, forEach, poolWidth, state, swapIndices }
}
