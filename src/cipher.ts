import isStrictZero from './utilities/isStrictZero'
import keySchedule from './keySchedule'
import length from './utilities/length'
import poolModule, { Pool, PoolInput } from './pool'
import remainder, { RemainderCallback } from './utilities/remainder'
import roundKeyModule, { RoundKey, RoundKeyInput } from './roundKey'

const defaultDrop = 3072,
  poolWidth = 256

interface CipherState {
  i: number
  pool: PoolInput['state']
  roundKey: RoundKeyInput['state']
}

interface CipherInput {
  drop?: number
  seed: string
  state?: CipherState
}

export type NumbersCipherTuple = [number[], Cipher]

export interface Cipher extends CipherInput {
  create: (newState: CipherState) => Cipher
  interval: (count: number) => NumbersCipherTuple
  keyStream: (count: number) => NumbersCipherTuple
  state: CipherState
}

export default function cipher({
  seed,
  drop: prevDrop = defaultDrop,
  state: { i: prevI, roundKey: prevRoundKeyState, pool: prevPoolState } = {
    i: 0,
    pool: undefined,
    roundKey: 0,
  },
}: CipherInput): Cipher {
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
      keyStreamLocal = keyStream

    while (length(result) < count) {
      const [key, nextCipher]: NumbersCipherTuple = keyStreamLocal(7),
        fiftyTwoBitBinary: string = key
          .map((k: number) => k.toString(2).padStart(8, '0'))
          .join('')
          .slice(4),
        fiftyTwoBitBinaryLength: number = length(fiftyTwoBitBinary),
        fiftyTwoBitDecimal: number = parseInt(fiftyTwoBitBinary, 2),
        generatedInterval: number =
          fiftyTwoBitDecimal * 2 ** -fiftyTwoBitBinaryLength

      result = [...result, generatedInterval]
      next = nextCipher
      keyStreamLocal = nextCipher.keyStream
    }

    return [result, next]
  }

  function keyStream(count: number): NumbersCipherTuple {
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
    ? keyStream(prevDrop)[1]
    : {
        create,
        drop,
        interval,
        keyStream,
        seed,
        state,
      }
}
