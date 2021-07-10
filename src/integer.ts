import type { LargeInteger } from './largeInteger'
import type { CipherInput, Octet } from './octet'
import largeInteger from './largeInteger'
import octet from './octet'
import { rangeUnderflowErrorMsg } from './octet/octet'

export type Integer = Octet | LargeInteger

export default function integer(props: CipherInput): Integer {
  let res: Integer

  try {
    res = octet(props)
  } catch ({ message }) {
    if (message === rangeUnderflowErrorMsg)
      throw new RangeError(rangeUnderflowErrorMsg)
    res = largeInteger(props)
  }

  return res
}
