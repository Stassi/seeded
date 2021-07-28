import type { NumberParams } from '../number'

export interface WeightedValue<T> {
  value: T
  weight: number
}

export interface SampleWeightedParams<T> extends Partial<NumberParams> {
  distribution: WeightedValue<T>[]
}

export interface SampleUniformParams<T> extends Partial<NumberParams> {
  distribution: T[]
}

export interface SampleParams<T>
  extends Pick<NumberParams, 'count' | 'drop' | 'seed' | 'state'> {
  distribution: (T | WeightedValue<T>)[]
}

export interface Sample<T> {
  generated: T[]
  next: (count?: NumberParams['count']) => Sample<T>
  state: NumberParams['state']
}
