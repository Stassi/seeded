import type { CipherComponent, CipherParams } from '../cipher'
import largeInteger from './largeInteger'
import negate from '../utilities/negate'
import octet from './octet'
import { poolWidth } from '../data'

export default function integer({
  max,
  min,
  ...props
}: CipherParams): CipherComponent {
  const octetRangeOverflow: boolean = max + negate(min) > poolWidth,
    cipherModule: (props: CipherParams) => CipherComponent = octetRangeOverflow
      ? largeInteger
      : octet

  return cipherModule({ max, min, ...props })
}
