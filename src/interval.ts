import cipher, {
  Cipher,
  CipherInput,
  CipherState,
  NumbersCipherTuple,
} from './cipher'

interface IntervalInput extends CipherInput {
  count?: number
}

export interface Interval {
  generated: NumbersCipherTuple[0]
  next: (nextCount?: number) => Interval
  state: CipherState
}

export default function interval({
  count = 1,
  ...props
}: IntervalInput = {}): Interval {
  const { interval: cipherInterval }: Cipher = cipher({ ...props })
  const [generated, { state }]: NumbersCipherTuple = cipherInterval(count)

  function next(nextCount = 1): Interval {
    return interval({
      state,
      count: nextCount,
      drop: 0,
    })
  }

  return { generated, next, state }
}
