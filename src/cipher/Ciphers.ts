import { AddToCallback } from '../arithmetic'
import { AtIndexProperty } from '../utilities/atIndex'
import { ForEachProperty } from '../utilities/forEach'
import { SwapIndicesProperty } from '../utilities/swapIndices'

type PoolState = number[]
type RoundKeyState = number

interface CipherStateProperty {
  state: {
    i: number
    pool: PoolState
    roundKey: RoundKeyState
  }
}

export interface CipherParams extends CipherStateProperty {
  count: number
  drop: number
  max: number
  min: number
}

export interface Cipher extends CipherStateProperty {
  generated: number[]
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
