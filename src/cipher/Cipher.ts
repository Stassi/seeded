import { AddToCallback } from '../arithmetic'
import { AtIndexProperty } from '../utilities/atIndex'
import { ForEachProperty } from '../utilities/forEach'
import { SwapIndicesProperty } from '../utilities/swapIndices'

type Count = number
type PoolState = number[]
type RoundKeyState = number

interface CipherStateProperty {
  state: {
    i: number
    pool: PoolState
    roundKey: RoundKeyState
  }
}

export interface Range {
  max: number
  min: number
}

export interface CipherParams extends CipherStateProperty, Range {
  count: Count
  drop: number
}

export interface CipherPersistentParams
  extends Partial<CipherParams>,
    Partial<{
      discrete: boolean
      seed: string
    }> {}

export interface Cipher extends CipherStateProperty {
  generated: number[]
}

export interface CipherPersistent extends Cipher {
  next: (count?: Count) => CipherPersistent
}

export interface CipherIntegerOrInterval {
  cipherModule: (props: CipherParams) => Cipher
  defaultMax: Range[keyof Range]
  throwIfRangeUnderflowError: ({ max, min }: Range) => void
}

export interface Key extends AtIndexProperty {}

export interface Pool
  extends AtIndexProperty,
    ForEachProperty,
    SwapIndicesProperty {
  create: (state: PoolState) => Pool
  state: PoolState
}

export interface RoundKey {
  addTo: AddToCallback
  create: (state: RoundKeyState) => RoundKey
  state: RoundKeyState
}
