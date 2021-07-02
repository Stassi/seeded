import type {
  Cipher,
  CipherInput,
  CipherState,
  NumbersCipherTuple,
} from './cipher'
import cipher from './cipher'

export interface OctetInput extends CipherInput {
  count?: number
}

export interface Octet {
  generated: NumbersCipherTuple[0]
  next: (nextCount?: number) => Octet
  state: CipherState
}

export default function octet({ count = 1, ...props }: OctetInput = {}): Octet {
  const { octet: cipherOctet }: Cipher = cipher({ ...props })
  const [generated, { state }]: NumbersCipherTuple = cipherOctet(count)

  function next(nextCount = 1): Octet {
    return octet({
      state,
      count: nextCount,
      drop: 0,
    })
  }

  return { generated, next, state }
}
