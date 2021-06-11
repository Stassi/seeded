import atIndexUtil, { AtIndexCallback } from './atIndex'

export interface SwapIndicesProperty {
  swapIndices: SwapIndicesCallback
}

export type SwapIndicesCallback = (x: number, y: number) => any[]

export default function swapIndices(a: any[]): SwapIndicesCallback {
  return (x: number, y: number): any[] => {
    const array: any[] = [...a],
      atIndex: AtIndexCallback = atIndexUtil(array),
      prevX: any = atIndex(x)

    array[x] = atIndex(y)
    array[y] = prevX

    return array
  }
}
