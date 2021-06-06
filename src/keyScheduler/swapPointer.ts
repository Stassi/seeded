import remainder from '../utilities/remainder'
import sum from '../utilities/sum'

interface SwapPointerInput {
  state?: number
  width: number
}

export interface SwapPointer extends SwapPointerInput {
  addTo: (...summands: number[]) => number
  create: (n: number) => SwapPointer
}

export default function swapPointer({
  width,
  state = 0,
}: SwapPointerInput): SwapPointer {
  const remainderWidth = remainder(width)

  function addTo(...summands: number[]): number {
    return remainderWidth(sum(state, ...summands))
  }

  function create(n: number): SwapPointer {
    return swapPointer({ width, state: n })
  }

  return { addTo, create, state, width }
}
