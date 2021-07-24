import type {
  Cipher,
  CipherIntegerOrInterval,
  CipherParams,
  CipherRangeUnderflowParams,
} from '../cipher'
import ceiling from '../utilities/ceiling'
import largeInteger from './largeInteger'
import octet from './octet'
import { add, negate } from '../arithmetic'
import {
  integerRangeUnderflowErrorMessage,
  maximumSafeBinary,
  poolWidth,
} from '../data'

const integer: CipherIntegerOrInterval = {
  cipherModule({ max, min, ...props }: CipherParams): Cipher {
    const octetRangeOverflow: boolean = add(max, negate(min)) > poolWidth,
      cipherModule: (props: CipherParams) => Cipher = octetRangeOverflow
        ? largeInteger
        : octet

    return cipherModule({ max, min, ...props })
  },
  defaultMax: maximumSafeBinary,
  throwIfRangeUnderflowError({ max, min }: CipherRangeUnderflowParams): void {
    if (ceiling(min) >= ceiling(max))
      throw new RangeError(integerRangeUnderflowErrorMessage)
  },
}

export default integer
