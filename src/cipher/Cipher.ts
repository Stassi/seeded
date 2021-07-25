import { AddToCallback } from '../arithmetic'
import { AtIndexProperty } from '../utilities/atIndex'
import { ForEachProperty } from '../utilities/forEach'
import { SwapIndicesProperty } from '../utilities/swapIndices'

interface CipherState {
  i: number
  pool: number[]
  roundKey: number
}

export interface CipherParams {
  count: number
  drop: number
  max: number
  min: number
  state: CipherState
}

export interface CipherParamsOptional {
  count?: CipherParams['count']
  discrete?: boolean
  drop?: CipherParams['drop']
  max?: CipherParams['max']
  min?: CipherParams['min']
  seed?: string
  state?: CipherState
}

export default interface Cipher {
  generated: number[]
  state: CipherState
}

export interface CipherPersistent extends Cipher {
  next: (count?: CipherParams['count']) => CipherPersistent
}

export interface CipherRangeUnderflowParams {
  max: CipherParams['max']
  min: CipherParams['min']
}

export interface CipherIntegerOrInterval {
  cipherModule: (props: CipherParams) => Cipher
  defaultMax: CipherParams['max']
  throwIfRangeUnderflowError: ({ max, min }: CipherRangeUnderflowParams) => void
}

export interface Pool
  extends AtIndexProperty,
    ForEachProperty,
    SwapIndicesProperty {
  create: (state: Pool['state']) => Pool
  state: CipherState['pool']
}

export interface RoundKey {
  addTo: AddToCallback
  create: (state: RoundKey['state']) => RoundKey
  state: CipherState['roundKey']
}
