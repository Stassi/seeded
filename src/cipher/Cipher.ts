import type { PoolInput } from './pool'
import type { RoundKeyInput } from './roundKey'

interface CipherState {
  i: number
  pool: PoolInput['state']
  roundKey: RoundKeyInput['state']
}

export interface CipherInput {
  count: number
  drop: number
  max: number
  min: number
  seed: string
  state: CipherState
}

export interface CipherInputOptional {
  count?: CipherInput['count']
  drop?: CipherInput['drop']
  max?: CipherInput['max']
  min?: CipherInput['min']
  seed?: CipherInput['seed']
  state?: CipherInput['state']
}

export default interface Cipher {
  generated: number[]
  next: (count?: number) => Cipher
  state: CipherInput['state']
}
