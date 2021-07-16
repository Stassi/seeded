import type { Cipher, CipherParams } from '../cipher'
import ceiling from '../utilities/ceiling'
import floorMap from '../utilities/floorMap'
import { intervalCipher } from './interval'

export default function largeInteger({
  count,
  max,
  min,
  state: prevState,
  ...props
}: CipherParams): Cipher {
  const { state, generated: generatedInterval }: Cipher = intervalCipher({
      ...props,
      count,
      max,
      min: ceiling(min),
      state: prevState,
    }),
    generated: Cipher['generated'] = floorMap(generatedInterval)

  return {
    generated,
    state,
  }
}
