import type { NumberParams } from '../number'

export interface SampleWeightedParams<T> extends Partial<NumberParams> {
  distribution: {
    value: T
    weight: number
  }[]
}

export interface SampleUniformParams<T> extends Partial<NumberParams> {
  distribution: T[]
}

export interface SampleWeighted<T> {
  generated: T[]
  next: (count?: NumberParams['count']) => SampleWeighted<T>
  state: NumberParams['state']
}

export interface SampleUniform<T> extends SampleWeighted<T> {}
