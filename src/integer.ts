import type { Cipher, CipherInput } from './cipher'
import largeInteger from './largeInteger'
import octet, { rangeUnderflowErrorMsg } from './octet'

export default function integer(props: CipherInput): Cipher {
  let res: Cipher

  try {
    res = octet(props)
  } catch ({ message }) {
    if (message === rangeUnderflowErrorMsg)
      throw new RangeError(rangeUnderflowErrorMsg)
    res = largeInteger(props)
  }

  return res
}
