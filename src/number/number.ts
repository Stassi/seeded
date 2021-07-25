import type {
  CipherIntegerOrInterval,
  CipherParams,
  CipherPersistent,
  CipherPersistentParams,
} from '../cipher'
import { defaultDrop } from '../data'
import integer from './integer'
import interval from './interval'
import { keySchedule } from '../cipher'
import timeSinceEpoch from '../utilities/timeSinceEpoch'

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
}: CipherPersistentParams = {}): CipherPersistent {
  const {
      cipherModule,
      defaultMax,
      throwIfRangeUnderflowError,
    }: CipherIntegerOrInterval = discrete ? integer : interval,
    max: CipherParams['max'] = prevMax ?? defaultMax

  throwIfRangeUnderflowError({ max, min })

  const { generated, state } = cipherModule({
    count,
    drop,
    max,
    min,
    state: prevState,
  })

  function next(
    newCount: CipherPersistentParams['count'] = 1
  ): CipherPersistent {
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
