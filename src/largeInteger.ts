import type { CipherInput } from './octet'
import type { Interval } from './interval'
import ceiling from './utilities/ceiling'
import floor from './utilities/floor'
import interval from './interval'
import maximumSafeBinary from './utilities/maximumSafeBinary'

export interface LargeInteger extends Interval {
  next: (count?: number) => LargeInteger
}

export default function largeInteger({
  max = maximumSafeBinary,
  min = 0,
  state: prevState,
  ...props
}: CipherInput = {}): LargeInteger {
  const { generated, state }: Interval = interval({
    ...props,
    max,
    min: ceiling(min),
    state: prevState,
  })

  function next(count: number = 1): LargeInteger {
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
