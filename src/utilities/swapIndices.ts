import atIndexUtil from './atIndex'

export type SwapIndicesCallback = (x: number, y: number) => any[]

export default function swapIndices(a: any[]): SwapIndicesCallback {
  return (x: number, y: number): any[] => {
    const array = [...a],
      atIndex = atIndexUtil(array),
      prevX = atIndex(x)

    array[x] = atIndex(y)
    array[y] = prevX

    return array
  }
}
