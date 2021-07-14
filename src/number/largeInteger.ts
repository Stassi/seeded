import type { Cipher, CipherInput } from '../cipher'
import ceiling from '../utilities/ceiling'
import floorMap from '../utilities/floorMap'
import interval from './interval'

export default function largeInteger({
  count,
  max,
  min,
  state: prevState,
  ...props
}: CipherInput): Cipher {
  const { state, generated: generatedInterval }: Cipher = interval({
      ...props,
      count,
      max,
      min: ceiling(min),
      state: prevState,
    }),
    generated: Cipher['generated'] = floorMap(generatedInterval)

  function next(nextCount: number = 1): Cipher {
    return largeInteger({
      ...props,
      max,
      min,
      state,
      count: nextCount,
      drop: 0,
    })
  }

  return {
    generated,
    next,
    state,
  }
}
