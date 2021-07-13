import type { Cipher, CipherInput } from '../cipher'
import isStrictZero from '../utilities/isStrictZero'
import length from '../utilities/length'
import octet from './integer/octet'
import octetToInterval, {
  octetsNeededForMaxSafeBinary,
} from '../utilities/octetToInterval'
import { intervalRangeUnderflowErrorMessage, poolWidth } from '../data'

export default function interval({
  count,
  drop,
  max,
  min,
  seed,
  state: prevState,
}: CipherInput): Cipher {
  const rangeUnderflow: boolean = min >= max

  if (rangeUnderflow) throw new RangeError(intervalRangeUnderflowErrorMessage)

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
      seed,
      state,
      count: nextCount,
      drop: 0,
    })
  }

  return { generated, next, state }
}
