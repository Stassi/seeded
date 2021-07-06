import type { Octet, OctetInput } from './octet'
import type { RemainderCallback } from './utilities/remainder'
import isStrictZero from './utilities/isStrictZero'
import length from './utilities/length'
import octet from './octet'
import remainder from './utilities/remainder'

interface IntegerInput extends OctetInput {
  max?: number
  min?: number
}

export interface Integer extends Octet {
  next: (count?: number) => Integer
}

export default function integer({
  count = 1,
  max = 10,
  min = 0,
  ...props
}: IntegerInput = {}): Integer {
  const remainderMax: RemainderCallback = remainder(max)

  let generated: Integer['generated'] = [],
    localNextOctet: Octet['next'] = () => octet(),
    state: Integer['state'] = {
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
      ? octet({ ...props })
      : localNextOctet()

    generated = [...generated, ...generatedOctet.map(remainderMax)]
    localNextOctet = nextOctet
    state = octetState
  }

  function next(nextCount = 1): Integer {
    return integer({
      max,
      min,
      state,
      count: nextCount,
      drop: 0,
    })
  }

  return { generated, next, state }
}
