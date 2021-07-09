import type { LargeInteger } from './largeInteger'
import type { CipherInput, Octet } from './octet'
import largeInteger from './largeInteger'
import octet from './octet'
import { rangeUnderflowErrorMsg } from './octet/octet'

export type OctetInteger = Octet | LargeInteger

export default function octetInteger(props: CipherInput): OctetInteger {
  let res: OctetInteger

  try {
    res = octet(props)
  } catch ({ message }) {
    if (message === rangeUnderflowErrorMsg)
      throw new RangeError(rangeUnderflowErrorMsg)
    res = largeInteger(props)
  }

  return res
}
