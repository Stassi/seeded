import atIndexUtil from '../utilities/atIndex'
import identityPermutation from '../utilities/identityPermutation'

interface PoolInput {
  state?: number[]
  width: number
}

type ForEachCallback = (value: number, index: number, array: number[]) => void

export interface Pool extends PoolInput {
  atIndex: (n: number) => any
  create: (s: number[]) => Pool
  forEach: (fn: ForEachCallback) => void
  swapIndices: (i: number, j: number) => number[]
}

export default function pool({
  width,
  state = identityPermutation(width),
}: PoolInput): Pool {
  const atIndex: (i: number) => number = atIndexUtil(state)

  function create(s: number[]): Pool {
    return pool({ width, state: s })
  }

  function forEach(fn: ForEachCallback): void {
    return state.forEach(fn)
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
