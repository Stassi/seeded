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

export interface Sample<T> {
  generated: T[]
  next: (count?: NumberParams['count']) => Sample<T>
  state: NumberParams['state']
}
