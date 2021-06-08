import atIndexUtil from '../utilities/atIndex'
import length from '../utilities/length'
import remainder from '../utilities/remainder'
import toCharCodes from '../utilities/toCharCodes'

export interface Key {
  atIndex: (n: number) => number
}

type KeyInput = number[] | string

export default function key(seed: KeyInput): Key {
  if (typeof seed === 'string') seed = toCharCodes(seed)

  const atOverflowableIndex: (i: number) => number = atIndexUtil(seed),
    remainderLength: (dividend: number) => number = remainder(length(seed))

  function atIndex(n: number): number {
    return atOverflowableIndex(remainderLength(n))
  }

  return { atIndex }
}
