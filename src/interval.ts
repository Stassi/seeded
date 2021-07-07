import type { Octet, OctetInput } from './octet'
import isStrictZero from './utilities/isStrictZero'
import length from './utilities/length'
import octet from './octet'
import octetToInterval, {
  octetsNeededForMaxSafeBinary,
} from './utilities/octetToInterval'

interface IntervalInput extends OctetInput {
  max?: number
  min?: number
}

export interface Interval extends Octet {
  next: (count?: number) => Interval
}

export default function interval({
  count = 1,
  max = 1,
  min = 0,
  ...props
}: IntervalInput = {}): Interval {
  let generated: Interval['generated'] = [],
    localNextOctet: Octet['next'] = () => octet(),
    state: Interval['state'] = {
      i: 0,
      pool: [],
      roundKey: 0,
    }

  while (length(generated) < count) {
    const {
      generated: generatedOctet,
      next: nextOctet,
      state: octetState,
    }: Octet = isStrictZero(length(generated))
      ? octet({
          count: octetsNeededForMaxSafeBinary,
          ...props,
        })
      : localNextOctet(octetsNeededForMaxSafeBinary)

    generated = [
      ...generated,
      octetToInterval(generatedOctet) * (max - min) + min,
    ]
    localNextOctet = nextOctet
    state = octetState
  }

  function next(nextCount = 1): Interval {
    return interval({
      max,
      min,
      state,
      count: nextCount,
      drop: 0,
    })
  }

  return { generated, next, state }
}
