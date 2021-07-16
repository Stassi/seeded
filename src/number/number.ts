import type {
  Cipher,
  CipherComponent,
  CipherParams,
  CipherParamsOptional,
} from '../cipher'
import ceiling from '../utilities/ceiling'
import integerModule from './integer'
import intervalModule from './interval'
import { keySchedule } from '../cipher'
import timeSinceEpoch from '../utilities/timeSinceEpoch'
import {
  defaultDrop,
  integerRangeUnderflowErrorMessage,
  intervalRangeUnderflowErrorMessage,
  maximumSafeBinary,
} from '../data'

interface RangeUnderflowParams {
  max: CipherParams['max']
  min: CipherParams['min']
}

interface IntegerOrInterval {
  cipherModule: (props: CipherParams) => CipherComponent
  defaultMax: CipherParams['max']
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

interface NumberParams extends CipherParamsOptional {
  discrete?: boolean
}

export default function number({
  count = 1,
  discrete = false,
  drop = defaultDrop,
  max: prevMax,
  min = 0,
  seed = `${timeSinceEpoch()}`,
  state: prevState = {
    i: 0,
    pool: keySchedule(seed).state,
    roundKey: 0,
  },
}: NumberParams = {}): Cipher {
  const {
      cipherModule,
      defaultMax,
      throwIfRangeUnderflowError,
    }: IntegerOrInterval = discrete ? integer : interval,
    max: CipherParams['max'] = prevMax ?? defaultMax

  throwIfRangeUnderflowError({ max, min })

  const { generated, state } = cipherModule({
    count,
    drop,
    max,
    min,
    seed,
    state: prevState,
  })

  function next(newCount: CipherParams['count'] = 1): Cipher {
    return number({
      discrete,
      max,
      min,
      seed,
      state,
      count: newCount,
      drop: 0,
    })
  }

  return {
    generated,
    next,
    state,
  }
}
