import type { Callback } from './Callback'
import type { N } from './numbers'
import atIndexUtil from './atIndex'

type SwapIndicesCallback<T> = (x: N, y: N) => T[]

export interface SwapIndicesProperty<T> {
  swapIndices: SwapIndicesCallback<T>
}

export default function swapIndices<T>(a: T[]): SwapIndicesCallback<T> {
  return (x: N, y: N): T[] => {
    const array: T[] = [...a],
      atIndex: Callback<N, T> = atIndexUtil(array),
      prevX: T = atIndex(x)

    array[x] = atIndex(y)
    array[y] = prevX

    return array
  }
}
