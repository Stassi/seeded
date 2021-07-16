import type { CipherComponent, CipherParams } from '../cipher'
import isStrictZero from '../utilities/isStrictZero'
import length from '../utilities/length'
import octet from './octet'
import octetToInterval, {
  octetsNeededForMaxSafeBinary,
} from '../utilities/octetToInterval'
import { poolWidth } from '../data'

export default function interval({
  count,
  drop,
  max,
  min,
  seed,
  state: prevState,
}: CipherParams): CipherComponent {
  let generated: CipherComponent['generated'] = [],
    state: CipherComponent['state'] = prevState

  while (length(generated) < count) {
    const { generated: generatedOctet, state: octetState }: CipherComponent =
      octet({
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

  return { generated, state }
}
