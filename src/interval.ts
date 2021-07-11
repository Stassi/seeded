import type { Cipher, CipherInputOptional } from './cipher'
import isStrictZero from './utilities/isStrictZero'
import length from './utilities/length'
import { octet } from './integer'
import octetToInterval, {
  octetsNeededForMaxSafeBinary,
} from './utilities/octetToInterval'
import timeSinceEpoch from './utilities/timeSinceEpoch'
import { defaultDrop, poolWidth } from './metrics.json'

export default function interval({
  count = 1,
  drop = defaultDrop,
  max = 1,
  min = 0,
  seed = `${timeSinceEpoch()}`,
  state: prevState = {
    i: 0,
    pool: undefined,
    roundKey: 0,
  },
}: CipherInputOptional = {}): Cipher {
  let generated: Cipher['generated'] = [],
    state: Cipher['state'] = prevState

  while (length(generated) < count) {
    const { generated: generatedOctet, state: octetState }: Cipher = octet({
      seed,
      state,
      count: octetsNeededForMaxSafeBinary,
      drop: isStrictZero(length(generated)) ? drop : 0,
      min: 0,
      max: poolWidth,
    })

    generated = [
      ...generated,
      octetToInterval(generatedOctet) * (max - min) + min,
    ]
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
