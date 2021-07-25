import { AddToCallback } from '../arithmetic'
import { AtIndexProperty } from '../utilities/atIndex'
import { ForEachProperty } from '../utilities/forEach'
import { SwapIndicesProperty } from '../utilities/swapIndices'

export interface CipherParams {
  count: number
  drop: number
  max: number
  min: number
  state: {
    i: number
    pool: number[]
    roundKey: number
  }
}

export interface CipherParamsOptional {
  count?: CipherParams['count']
  discrete?: boolean
  drop?: CipherParams['drop']
  max?: CipherParams['max']
  min?: CipherParams['min']
  seed?: string
  state?: CipherParams['state']
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

export interface CipherPersistent extends Cipher {
  next: (count?: CipherParams['count']) => CipherPersistent
}

export default interface Cipher {
  generated: number[]
  state: CipherParams['state']
}

export interface Pool
  extends AtIndexProperty,
    ForEachProperty,
    SwapIndicesProperty {
  create: (state: Pool['state']) => Pool
  state: CipherParams['state']['pool']
}

export interface RoundKey {
  addTo: AddToCallback
  create: (state: RoundKey['state']) => RoundKey
  state: CipherParams['state']['roundKey']
}
