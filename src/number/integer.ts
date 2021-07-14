import type { Cipher, CipherInput } from '../cipher'
import largeInteger from './largeInteger'
import negate from '../utilities/negate'
import octet from './octet'
import { poolWidth } from '../data'

export default function integer({ max, min, ...props }: CipherInput): Cipher {
  const octetRangeOverflow: boolean = max + negate(min) > poolWidth,
    cipherModule: (props: CipherInput) => Cipher = octetRangeOverflow
      ? largeInteger
      : octet

  return cipherModule({ max, min, ...props })
}
