import type { Cipher, CipherInput, NumbersCipherTuple } from './cipher'
import cipher from './cipher'

interface OctetInput extends CipherInput {
  count?: number
}

export interface Octet {
  generated: number[]
  next: ({ ...OctetInput }) => Octet
}

export default function octet({ count = 1, ...props }: OctetInput = {}): Octet {
  const { octet: cipherOctet }: Cipher = cipher({ ...props })
  const [generated, { state }]: NumbersCipherTuple = cipherOctet(count)

  function next({ count: newCount = 1 }: OctetInput): Octet {
    return octet({
      state,
      count: newCount,
      drop: 0,
    })
  }

  return { generated, next }
}
