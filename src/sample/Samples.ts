import { CipherPersistentParams } from '../cipher'

export interface SampleWeightedParams<T>
  extends Partial<CipherPersistentParams> {
  distribution: {
    value: T
    weight: number
  }[]
}

export interface SampleUniformParams<T>
  extends Partial<CipherPersistentParams> {
  distribution: T[]
}

export interface SampleWeighted<T> {
  generated: T[]
  next: (count?: CipherPersistentParams['count']) => SampleWeighted<T>
  state: CipherPersistentParams['state']
}

export interface SampleUniform<T> extends SampleWeighted<T> {}
