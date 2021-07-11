import type { Cipher, CipherInput, CipherInputOptional } from '../cipher'
import ceiling from '../utilities/ceiling'
import largeInteger from './largeInteger'
import maximumSafeBinary from '../utilities/maximumSafeBinary'
import negate from '../utilities/negate'
import octet from './octet'
import timeSinceEpoch from '../utilities/timeSinceEpoch'
import { defaultDrop, poolWidth } from '../integers.json'
import { range as rangeErrorMessages } from '../errorMessages.json'

export default function integer({
  count = 1,
  drop = defaultDrop,
  max = maximumSafeBinary,
  min = 0,
  seed = `${timeSinceEpoch()}`,
  state = {
    i: 0,
    pool: undefined,
    roundKey: 0,
  },
}: CipherInputOptional = {}): Cipher {
  const props: CipherInput = {
      count,
      drop,
      max,
      min,
      seed,
      state,
    },
    octetRangeOverflow: boolean = max + negate(min) > poolWidth,
    rangeUnderflow: boolean = ceiling(min) >= ceiling(max)

  if (rangeUnderflow) throw new RangeError(rangeErrorMessages.underflow)

  return octetRangeOverflow ? largeInteger(props) : octet(props)
}
