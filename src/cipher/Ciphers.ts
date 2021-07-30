import type { NumberProperties, NumbersProperties } from '../utilities/numbers'

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
