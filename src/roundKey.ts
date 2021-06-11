import remainder from './utilities/remainder'
import sum from './utilities/sum'

interface RoundKeyInput {
  state?: number
  width: number
}

export interface RoundKey extends RoundKeyInput {
  addTo: (...summands: number[]) => number
  create: (n: number) => RoundKey
}

export default function roundKey({
  width,
  state = 0,
}: RoundKeyInput): RoundKey {
  const remainderWidth = remainder(width)

  function addTo(...summands: number[]): number {
    return sum(state, ...summands)
  }

  function create(n: RoundKeyInput['state']): RoundKey {
    return roundKey({ width, state: remainderWidth(n) })
  }

  return { addTo, create, state, width }
}
