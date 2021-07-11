import type { Cipher, CipherInputOptional } from './cipher'
import isStrictZero from './utilities/isStrictZero'
import length from './utilities/length'
import octet from './octet'
import octetToInterval, {
  octetsNeededForMaxSafeBinary,
} from './utilities/octetToInterval'
import timeSinceEpoch from './utilities/timeSinceEpoch'
import { defaultDrop, poolWidth } from './integers.json'

export default function interval({
  count = 1,
  drop = defaultDrop,
  max = 1,
  min = 0,
  seed = `${timeSinceEpoch()}`,
  state = {
    i: 0,
    pool: undefined,
    roundKey: 0,
  },
}: CipherInputOptional = {}): Cipher {
  let generated: Cipher['generated'] = [],
    localNextOctet: Cipher['next'] = () =>
      octet({ count, drop, max, min, seed, state })

  while (length(generated) < count) {
    const {
      generated: generatedOctet,
      next: nextOctet,
      state: octetState,
    }: Cipher = isStrictZero(length(generated))
      ? octet({
          drop,
          seed,
          state,
          count: octetsNeededForMaxSafeBinary,
          min: 0,
          max: poolWidth,
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
