import type { CipherInput } from './octet'
import type { Interval } from './interval'
import ceiling from './utilities/ceiling'
import floor from './utilities/floor'
import interval from './interval'
import maximumSafeBinary from './utilities/maximumSafeBinary'

export interface Integer extends Interval {
  next: (count?: number) => Integer
}

export default function integer({
  max = maximumSafeBinary,
  min = 0,
  state: prevState,
  ...props
}: CipherInput = {}): Integer {
  const { generated, state }: Interval = interval({
    ...props,
    max,
    min: ceiling(min),
    state: prevState,
  })

  function next(count: number = 1): Integer {
    return integer({
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
