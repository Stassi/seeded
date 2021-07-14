import type { Cipher, CipherInput } from '../cipher'
import largeInteger from './largeInteger'
import negate from '../utilities/negate'
import octet from './octet'
import { poolWidth } from '../data'

export default function integer({ max, min, ...props }: CipherInput): Cipher {
  const options = { max, min, ...props },
    octetRangeOverflow: boolean = max + negate(min) > poolWidth

  return octetRangeOverflow ? largeInteger(options) : octet(options)
}
