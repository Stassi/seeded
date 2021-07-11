import type { Cipher, CipherInputOptional } from './cipher'
import isStrictZero from './utilities/isStrictZero'
import length from './utilities/length'
import octet from './octet'
import octetToInterval, {
  octetsNeededForMaxSafeBinary,
} from './utilities/octetToInterval'

export default function interval({
  count = 1,
  max = 1,
  min = 0,
  ...props
}: CipherInputOptional = {}): Cipher {
  let generated: Cipher['generated'] = [],
    localNextOctet: Cipher['next'] = () => octet({ count, max, min, ...props }),
    state: Cipher['state'] = {
      i: 0,
      pool: [],
      roundKey: 0,
    }

  while (length(generated) < count) {
    const {
      generated: generatedOctet,
      next: nextOctet,
      state: octetState,
    }: Cipher = isStrictZero(length(generated))
      ? octet({
          count: octetsNeededForMaxSafeBinary,
          ...props,
        })
      : localNextOctet(octetsNeededForMaxSafeBinary)

    generated = [
      ...generated,
      octetToInterval(generatedOctet) * (max - min) + min,
    ]
    localNextOctet = nextOctet
    state = octetState
  }

  function next(nextCount = 1): Cipher {
    return interval({
      max,
      min,
      state,
      count: nextCount,
      drop: 0,
    })
  }

  return { generated, next, state }
}
