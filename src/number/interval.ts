import type {
  Cipher,
  CipherIntegerOrInterval,
  CipherParams,
  Range,
} from '../cipher'
import isStrictZero from '../utilities/isStrictZero'
import length from '../utilities/length'
import octet from './octet'
import { add, multiply, negate } from '../arithmetic'
import { intervalRangeUnderflowErrorMessage, poolWidth } from '../data'
import octetToInterval, {
  octetsNeededForMaxSafeBinary,
} from '../utilities/octetToInterval'

export function intervalCipher({
  count,
  drop,
  max,
  min,
  state: prevState,
}: CipherParams): Cipher {
  let generated: Cipher['generated'] = [],
    state: Cipher['state'] = prevState

  while (length(generated) < count) {
    const { generated: generatedOctet, state: octetState }: Cipher = octet({
        state,
        count: octetsNeededForMaxSafeBinary,
        drop: isStrictZero(length(generated)) ? drop : 0,
        max: poolWidth,
        min: 0,
      }),
      prevGenerated: number = add(
        min,
        multiply(octetToInterval(generatedOctet), add(max, negate(min)))
      ),
      overflow: boolean = prevGenerated >= max

    generated = overflow ? generated : [...generated, prevGenerated]
    state = octetState
  }

  return { generated, state }
}

const interval: CipherIntegerOrInterval = {
  cipherModule: intervalCipher,
  defaultMax: 1,
  throwIfRangeUnderflowError({ max, min }: Range): void {
    if (min >= max) throw new RangeError(intervalRangeUnderflowErrorMessage)
  },
}

export default interval
