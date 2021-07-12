import type { Cipher, CipherInput } from '../../cipher'
import ceiling from '../../utilities/ceiling'
import largeInteger from './largeInteger'
import negate from '../../utilities/negate'
import octet from './octet'
import { integerRangeUnderflowErrorMessage, poolWidth } from '../../data'

export default function integer({ max, min, ...props }: CipherInput): Cipher {
  const options = { max, min, ...props },
    rangeUnderflow: boolean = ceiling(min) >= ceiling(max),
    octetRangeOverflow: boolean = max + negate(min) > poolWidth

  if (rangeUnderflow) throw new RangeError(integerRangeUnderflowErrorMessage)

  return octetRangeOverflow ? largeInteger(options) : octet(options)
}
