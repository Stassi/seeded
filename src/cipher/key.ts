import type { Key } from './Cipher'
import type { RemainderCallback } from '../arithmetic'
import atIndexUtil from '../utilities/atIndex'
import length from '../utilities/length'
import { remainder } from '../arithmetic'
import toCharCodes from '../utilities/toCharCodes'

export default function key(seedParam: string): Key {
  const seed: number[] = toCharCodes(seedParam),
    atOverflowableIndex: Key['atIndex'] = atIndexUtil(seed),
    remainderLength: RemainderCallback = remainder(length(seed))

  function atIndex(n: number): number {
    return atOverflowableIndex(remainderLength(n))
  }

  return { atIndex }
}
