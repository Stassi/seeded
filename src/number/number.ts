import type { Cipher, CipherInput, CipherInputOptional } from '../cipher'
import ceiling from '../utilities/ceiling'
import integerModule from './integer'
import intervalModule from './interval'
import timeSinceEpoch from '../utilities/timeSinceEpoch'
import {
  defaultDrop,
  integerRangeUnderflowErrorMessage,
  intervalRangeUnderflowErrorMessage,
  maximumSafeBinary,
} from '../data'

interface RangeUnderflowParams {
  max: CipherInput['max']
  min: CipherInput['min']
}

interface IntegerOrInterval {
  cipherModule: (props: CipherInput) => Cipher
  defaultMax: CipherInput['max']
  throwIfRangeUnderflowError: ({ max, min }: RangeUnderflowParams) => void
}

const integer: IntegerOrInterval = {
  cipherModule: integerModule,
  defaultMax: maximumSafeBinary,
  throwIfRangeUnderflowError: ({ max, min }: RangeUnderflowParams) => {
    if (ceiling(min) >= ceiling(max))
      throw new RangeError(integerRangeUnderflowErrorMessage)
  },
}

const interval: IntegerOrInterval = {
  cipherModule: intervalModule,
  defaultMax: 1,
  throwIfRangeUnderflowError: ({ max, min }: RangeUnderflowParams) => {
    if (min >= max) throw new RangeError(intervalRangeUnderflowErrorMessage)
  },
}

interface NumberParams extends CipherInputOptional {
  discrete?: boolean
}

export default function number({
  count = 1,
  discrete = false,
  drop = defaultDrop,
  max: prevMax,
  min = 0,
  seed = `${timeSinceEpoch()}`,
  state = {
    i: 0,
    pool: undefined,
    roundKey: 0,
  },
}: NumberParams = {}): Cipher {
  const {
      cipherModule,
      defaultMax,
      throwIfRangeUnderflowError,
    }: IntegerOrInterval = discrete ? integer : interval,
    max: CipherInput['max'] = prevMax ?? defaultMax

  throwIfRangeUnderflowError({ max, min })

  return cipherModule({
    count,
    drop,
    max,
    min,
    seed,
    state,
  })
}
