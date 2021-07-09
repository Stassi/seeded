import type { Integer } from './integer'
import type { CipherInput, Octet } from './octet'
import integer from './integer'
import octet from './octet'
import { rangeUnderflowErrorMsg } from './octet/octet'

export type OctetInteger = Octet | Integer

export default function octetInteger(props: CipherInput): OctetInteger {
  let res: OctetInteger

  try {
    res = octet(props)
  } catch ({ message }) {
    if (message === rangeUnderflowErrorMsg)
      throw new RangeError(rangeUnderflowErrorMsg)
    res = integer(props)
  }

  return res
}
