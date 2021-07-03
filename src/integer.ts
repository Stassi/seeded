import type { Octet, OctetInput } from './octet'

interface IntegerInput extends OctetInput {}

export interface Integer extends Octet {
  next: (count?: number) => Integer
}

export default function integer({ ...props }: IntegerInput = {}): Integer {
  let generated: Integer['generated'] = [],
    state: Integer['state'] = {
      i: 0,
      pool: [],
      roundKey: 0,
    }

  function next(nextCount = 1): Integer {
    return integer({
      state,
      count: nextCount,
      drop: 0,
    })
  }

  return { generated, next, state }
}
