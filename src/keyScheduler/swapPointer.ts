import { remainder256 } from '../utilities/remainder'
import sum from '../utilities/sum'

interface SwapPointerInput {
  state: number
}

export interface SwapPointer extends SwapPointerInput {
  addTo: (...summands: number[]) => number
  create: (n: number) => SwapPointer
}

export default function swapPointer(
  { state }: SwapPointerInput = { state: 0 }
): SwapPointer {
  function addTo(...summands: number[]): number {
    return remainder256(sum(state, ...summands))
  }

  function create(n: number): SwapPointer {
    return swapPointer({ state: n })
  }

  return { addTo, create, state }
}
