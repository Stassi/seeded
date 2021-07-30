import type { AtIndexProperty } from '../utilities/atIndex'
import type { Callback } from '../utilities/Callback'
import type { ForEachProperty } from '../utilities/forEach'
import type { SwapIndicesProperty } from '../utilities/swapIndices'
import type {
  N,
  Ns,
  NumberCallback,
  NumberProperties,
  NumbersProperties,
} from '../utilities/numbers'

interface CipherState
  extends NumberProperties<'i' | 'roundKey'>,
    NumbersProperties<'pool'> {}

interface CipherStateProperty {
  state: CipherState
}

export interface CipherParams
  extends CipherStateProperty,
    NumberProperties<'count' | 'drop' | 'max' | 'min'> {}

export interface Cipher
  extends CipherStateProperty,
    NumbersProperties<'generated'> {}

export interface Key extends AtIndexProperty {}

type RecursiveState<Self, State> = {
  create: Callback<State, Self>
  state: State
}

export interface Pool
  extends AtIndexProperty,
    ForEachProperty,
    SwapIndicesProperty,
    RecursiveState<Pool, Ns> {}

export interface RoundKey extends RecursiveState<RoundKey, N> {
  addTo: NumberCallback
}
