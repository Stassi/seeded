import { PoolState } from './pool'
import { RoundKeyState } from './roundKey'

export interface CipherParams {
  count: number
  drop: number
  max: number
  min: number
  seed: string
  state: {
    i: number
    pool: PoolState
    roundKey: RoundKeyState
  }
}

export interface CipherParamsOptional {
  count?: CipherParams['count']
  discrete?: boolean
  drop?: CipherParams['drop']
  max?: CipherParams['max']
  min?: CipherParams['min']
  seed?: CipherParams['seed']
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
