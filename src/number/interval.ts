import type {
  Cipher,
  CipherIntegerOrInterval,
  CipherParams,
  CipherRangeUnderflowParams,
} from '../cipher'
import isStrictZero from '../utilities/isStrictZero'
import length from '../utilities/length'
import octet from './octet'
import octetToInterval, {
  octetsNeededForMaxSafeBinary,
} from '../utilities/octetToInterval'
import { intervalRangeUnderflowErrorMessage, poolWidth } from '../data'

export function intervalCipher({
  count,
  drop,
  max,
  min,
  seed,
  state: prevState,
}: CipherParams): Cipher {
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
      }),
      prevGenerated: number =
        octetToInterval(generatedOctet) * (max - min) + min,
      overflow: boolean = prevGenerated >= max

    generated = overflow ? generated : [...generated, prevGenerated]
    state = octetState
  }

  return { generated, state }
}

const interval: CipherIntegerOrInterval = {
  cipherModule: intervalCipher,
  defaultMax: 1,
  throwIfRangeUnderflowError({ max, min }: CipherRangeUnderflowParams) {
    if (min >= max) throw new RangeError(intervalRangeUnderflowErrorMessage)
  },
}

export default interval
