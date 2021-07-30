import type { Key } from './Ciphers'
import type { NumberCallback } from '../utilities/numbers'
import atIndexUtil from '../utilities/atIndex'
import length from '../utilities/length'
import { remainder } from '../arithmetic'
import toCharCodes from '../utilities/toCharCodes'

export default function key(seedParam: string): Key {
  const seed: number[] = toCharCodes(seedParam),
    atOverflowableIndex: Key['atIndex'] = atIndexUtil(seed),
    remainderLength: NumberCallback = remainder(length(seed))

  return {
    atIndex(n: number): number {
      return atOverflowableIndex(remainderLength(n))
    },
  }
}
