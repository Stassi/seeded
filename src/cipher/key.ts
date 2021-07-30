import type { AtIndexProperty } from '../utilities/atIndex'
import type { N, NumberCallback } from '../utilities/numbers'
import type { S as Seed } from '../utilities/strings'
import atIndexUtil from '../utilities/atIndex'
import length from '../utilities/length'
import { remainder } from '../arithmetic'
import toCharCodes from '../utilities/toCharCodes'

type CharacterCodes = ReturnType<typeof toCharCodes>
interface Key extends AtIndexProperty<N> {}

export default function key(seedParam: Seed): Key {
  const seed: CharacterCodes = toCharCodes(seedParam),
    atOverflowableIndex: NumberCallback = atIndexUtil(seed),
    remainderLength: NumberCallback = remainder(length(seed))

  return {
    atIndex(n: N): N {
      return atOverflowableIndex(remainderLength(n))
    },
  }
}
