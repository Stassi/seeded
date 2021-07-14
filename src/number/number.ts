import type { Cipher, CipherInput, CipherInputOptional } from '../cipher'
import ceiling from '../utilities/ceiling'
import integer from './integer'
import interval from './interval'
import timeSinceEpoch from '../utilities/timeSinceEpoch'
import {
  defaultDrop,
  integerRangeUnderflowErrorMessage,
  intervalRangeUnderflowErrorMessage,
  maximumSafeBinary,
} from '../data'

interface NumberInput extends CipherInputOptional {
  discrete?: boolean
}

export default function number({
  count = 1,
  discrete = false,
  drop = defaultDrop,
  max = discrete ? maximumSafeBinary : 1,
  min = 0,
  seed = `${timeSinceEpoch()}`,
  state = {
    i: 0,
    pool: undefined,
    roundKey: 0,
  },
}: NumberInput = {}): Cipher {
  const props: CipherInput = {
      count,
      drop,
      max,
      min,
      seed,
      state,
    },
    rangeUnderflow: boolean = discrete
      ? ceiling(min) >= ceiling(max)
      : min >= max,
    rangeUnderflowErrorMessage: string = discrete
      ? integerRangeUnderflowErrorMessage
      : intervalRangeUnderflowErrorMessage,
    integerOrInterval: (props: CipherInput) => Cipher = discrete
      ? integer
      : interval

  if (rangeUnderflow) throw new RangeError(rangeUnderflowErrorMessage)

  return integerOrInterval(props)
}
