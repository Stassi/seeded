import type { Cipher, CipherInput } from './cipher'
import ceiling from './utilities/ceiling'
import floor from './utilities/floor'
import interval from './interval'
import maximumSafeBinary from './utilities/maximumSafeBinary'

export default function largeInteger({
  max = maximumSafeBinary,
  min = 0,
  state: prevState,
  ...props
}: CipherInput = {}): Cipher {
  const { generated, state }: Cipher = interval({
    ...props,
    max,
    min: ceiling(min),
    state: prevState,
  })

  function next(count: number = 1): Cipher {
    return largeInteger({
      ...props,
      count,
      max,
      min,
      state,
      drop: 0,
    })
  }

  return {
    next,
    state,
    generated: generated.map(floor),
  }
}
