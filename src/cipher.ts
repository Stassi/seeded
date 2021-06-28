import isStrictZero from './utilities/isStrictZero'
import keySchedule from './keySchedule'
import length from './utilities/length'
import poolModule, { Pool, PoolInput } from './pool'
import remainder, { RemainderCallback } from './utilities/remainder'
import roundKeyModule, { RoundKey, RoundKeyInput } from './roundKey'
import octetToInterval, {
  octetsNeededForMaxSafeBinary,
} from './utilities/octetToInterval'
import timeSinceEpoch from './utilities/timeSinceEpoch'
import { defaultDrop, poolWidth } from './integers.json'

interface CipherState {
  i: number
  pool: PoolInput['state']
  roundKey: RoundKeyInput['state']
}

interface CipherInput {
  drop?: number
  seed?: string
  state?: CipherState
}

export type NumbersCipherTuple = [number[], Cipher]

export interface Cipher {
  create: (newState: CipherState) => Cipher
  interval: (count: number) => NumbersCipherTuple
  octet: (count: number) => NumbersCipherTuple
  state: CipherState
}

export default function cipher({
  drop: prevDrop = defaultDrop,
  seed = `${timeSinceEpoch()}`,
  state: { i: prevI, roundKey: prevRoundKeyState, pool: prevPoolState } = {
    i: 0,
    pool: undefined,
    roundKey: 0,
  },
}: CipherInput = {}): Cipher {
  const drop: number = 0,
    isNonZeroDrop: boolean = !isStrictZero(prevDrop),
    remainderWidth: RemainderCallback = remainder(poolWidth),
    prevPool: Pool = prevPoolState
      ? poolModule({ state: prevPoolState, width: poolWidth })
      : keySchedule({ seed, width: poolWidth }),
    state = {
      i: prevI,
      pool: prevPool.state,
      roundKey: prevRoundKeyState,
    }

  function create(newState: CipherState): Cipher {
    return cipher({
      drop,
      seed,
      state: newState,
    })
  }

  function interval(count: number): NumbersCipherTuple {
    let result: NumbersCipherTuple[0] = [],
      next: NumbersCipherTuple[1] = create(state),
      octetLocal = octet

    while (length(result) < count) {
      const [generatedOctet, nextCipher]: NumbersCipherTuple = octetLocal(
        octetsNeededForMaxSafeBinary
      )

      result = [...result, octetToInterval(generatedOctet)]
      next = nextCipher
      octetLocal = nextCipher.octet
    }

    return [result, next]
  }

  function octet(count: number): NumbersCipherTuple {
    let i: number = prevI,
      roundKey: RoundKey = roundKeyModule({
        state: prevRoundKeyState,
        width: poolWidth,
      }),
      pool: Pool = prevPool.create(prevPool.state),
      key: number[] = []

    while (length(key) < count) {
      i = remainderWidth(i + 1)
      roundKey = roundKey.create(roundKey.addTo(pool.atIndex(i)))
      pool = pool.create(pool.swapIndices(i, roundKey.state))
      key = [
        ...key,
        pool.atIndex(
          remainderWidth(pool.atIndex(i) + pool.atIndex(roundKey.state))
        ),
      ]
    }

    return [
      key,
      create({
        i,
        pool: pool.state,
        roundKey: roundKey.state,
      }),
    ]
  }

  return isNonZeroDrop
    ? octet(prevDrop)[1]
    : {
        create,
        interval,
        octet,
        state,
      }
}
