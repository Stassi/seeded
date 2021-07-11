import type { Cipher, CipherInput, CipherInputOptional } from '../cipher'
import ceiling from '../utilities/ceiling'
import largeInteger from './largeInteger'
import negate from '../utilities/negate'
import octet from './octet'
import timeSinceEpoch from '../utilities/timeSinceEpoch'
import {
  defaultDrop,
  integerRangeUnderflowErrorMessage,
  maximumSafeBinary,
  poolWidth,
} from '../data'

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
    rangeUnderflow: boolean = ceiling(min) >= ceiling(max),
    octetRangeOverflow: boolean = max + negate(min) > poolWidth

  if (rangeUnderflow) throw new RangeError(integerRangeUnderflowErrorMessage)

  return octetRangeOverflow ? largeInteger(props) : octet(props)
}
