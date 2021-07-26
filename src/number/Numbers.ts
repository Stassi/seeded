import type { Cipher, CipherParams, Range } from '../cipher'

export interface NumberParams
  extends Partial<CipherParams>,
    Partial<{
      discrete: boolean
      seed: string
    }> {}

export interface Number extends Cipher {
  next: (count?: CipherParams['count']) => Number
}

export interface IntegerOrInterval {
  cipherModule: (props: CipherParams) => Cipher
  defaultMax: Range[keyof Range]
  throwIfRangeUnderflowError: ({ max, min }: Range) => void
}
