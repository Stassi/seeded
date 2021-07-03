import type { AtIndexProperty } from '../utilities/atIndex'
import type { RemainderCallback } from '../utilities/remainder'
import atIndexUtil from '../utilities/atIndex'
import length from '../utilities/length'
import remainder from '../utilities/remainder'
import toCharCodes from '../utilities/toCharCodes'

export interface Key extends AtIndexProperty {}

export default function key(seedParam: string): Key {
  const seed: number[] = toCharCodes(seedParam),
    atOverflowableIndex: Key['atIndex'] = atIndexUtil(seed),
    remainderLength: RemainderCallback = remainder(length(seed))

  function atIndex(n: number): number {
    return atOverflowableIndex(remainderLength(n))
  }

  return { atIndex }
}
