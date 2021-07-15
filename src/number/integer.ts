import type { Cipher, CipherParams } from '../cipher'
import largeInteger from './largeInteger'
import negate from '../utilities/negate'
import octet from './octet'
import { poolWidth } from '../data'

export default function integer({ max, min, ...props }: CipherParams): Cipher {
  const octetRangeOverflow: boolean = max + negate(min) > poolWidth,
    cipherModule: (props: CipherParams) => Cipher = octetRangeOverflow
      ? largeInteger
      : octet

  return cipherModule({ max, min, ...props })
}
