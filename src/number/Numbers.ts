import type { Cipher, CipherParams } from '../cipher'

export interface NumberParams
  extends Partial<CipherParams>,
    Partial<{
      discrete: boolean
      seed: string
    }> {}

export interface Number extends Cipher {
  next: (count?: CipherParams['count']) => Number
}

type RangeParams = Pick<CipherParams, 'max' | 'min'>

export interface IntegerOrInterval {
  cipherModule: (props: CipherParams) => Cipher
  defaultMax: RangeParams[keyof RangeParams]
  throwIfRangeUnderflowError: ({ max, min }: RangeParams) => void
}
