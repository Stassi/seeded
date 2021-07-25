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

export interface Cipher {
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

export interface Key extends AtIndexProperty {}

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

export interface SampleParams<T> {
  count?: CipherParamsOptional['count']
  distribution: {
    value: T
    weight: number
  }[]
  drop?: CipherParamsOptional['drop']
  seed?: CipherParamsOptional['seed']
  state?: CipherState
}

export interface SampleUniformParams<T> {
  count?: CipherParamsOptional['count']
  distribution: T[]
  drop?: CipherParamsOptional['drop']
  seed?: CipherParamsOptional['seed']
  state?: CipherState
}

export interface Sample<T> {
  generated: T[]
  next: (count?: CipherParams['count']) => Sample<T>
  state: CipherState
}

export interface SampleUniform<T> extends Sample<T> {}
