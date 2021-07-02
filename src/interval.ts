import type { Octet, OctetInput } from './octet'
import isStrictZero from './utilities/isStrictZero'
import length from './utilities/length'
import octet from './octet'
import octetToInterval, {
  octetsNeededForMaxSafeBinary,
} from './utilities/octetToInterval'

interface IntervalInput extends OctetInput {}

export interface Interval extends Octet {
  next: (count?: number) => Interval
}

export default function interval({
  count = 1,
  ...props
}: IntervalInput = {}): Interval {
  let generated: Interval['generated'] = [],
    state: Interval['state'] = {
      i: 0,
      pool: [],
      roundKey: 0,
    },
    localNextOctet: Octet['next'] = () => octet()

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

    generated = [...generated, octetToInterval(generatedOctet)]
    localNextOctet = nextOctet
    state = octetState
  }

  function next(nextCount = 1): Interval {
    return interval({
      state,
      count: nextCount,
      drop: 0,
    })
  }

  return { generated, next, state }
}
