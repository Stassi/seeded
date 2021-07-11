import type { Cipher, CipherInput } from './cipher'
import ceiling from './utilities/ceiling'
import floor from './utilities/floor'
import interval from './interval'

export default function largeInteger({
  count,
  max,
  min,
  state: prevState,
  ...props
}: CipherInput): Cipher {
  const { generated, state }: Cipher = interval({
    ...props,
    count,
    max,
    min: ceiling(min),
    state: prevState,
  })

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
    next,
    state,
    generated: generated.map(floor),
  }
}
