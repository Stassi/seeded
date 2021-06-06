import atIndexUtil from '../utilities/atIndex'
import identityPermutation from '../utilities/identityPermutation'

interface PoolInput {
  poolWidth: number
  state?: number[]
}

type ForEachCallback = (value: number, index: number, array: number[]) => void

export interface Pool extends PoolInput {
  atIndex: (n: number) => any
  clone: () => Pool
  forEach: (fn: ForEachCallback) => void
}

export default function pool({
  poolWidth,
  state = identityPermutation(poolWidth),
}: PoolInput): Pool {
  function atIndex(n: number): any {
    return atIndexUtil(state)(n)
  }

  function clone(): Pool {
    return pool({ poolWidth, state: [...state] })
  }

  function forEach(fn: ForEachCallback): void {
    return state.forEach(fn)
  }

  return { atIndex, clone, forEach, poolWidth, state }
}
