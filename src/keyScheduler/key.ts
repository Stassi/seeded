import atIndexUtil from '../utilities/atIndex'
import length from '../utilities/length'
import remainder from '../utilities/remainder'

export interface Key {
  atIndex: (n: number) => number
}

export default function key(k: number[]): Key {
  const atOverflowableIndex = atIndexUtil(k)
  const remainderLength = remainder(length(k))

  function atIndex(n: number): number {
    return atOverflowableIndex(remainderLength(n))
  }

  return { atIndex }
}
