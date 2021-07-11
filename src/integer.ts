import type { Cipher, CipherInput, CipherInputOptional } from './cipher'
import largeInteger from './largeInteger'
import octet, { rangeUnderflowErrorMsg } from './octet'
import timeSinceEpoch from './utilities/timeSinceEpoch'
import { defaultDrop, poolWidth } from './integers.json'

export default function integer({
  count = 1,
  drop = defaultDrop,
  max = poolWidth,
  min = 0,
  seed = `${timeSinceEpoch()}`,
  state = {
    i: 0,
    pool: undefined,
    roundKey: 0,
  },
}: CipherInputOptional = {}): Cipher {
  const props: CipherInput = { count, drop, max, min, seed, state }

  let res: Cipher

  try {
    res = octet(props)
  } catch ({ message }) {
    if (message === rangeUnderflowErrorMsg)
      throw new RangeError(rangeUnderflowErrorMsg)
    res = largeInteger(props)
  }

  return res
}
