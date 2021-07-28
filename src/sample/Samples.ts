import type { NumberParams } from '../number'
import isStrictZero from '../utilities/isStrictZero'
import length from '../utilities/length'

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
  state: NumberParams['state']
}

export interface SamplePersistent<T> extends Sample<T> {
  next: (count?: NumberParams['count']) => SamplePersistent<T>
}

export function expandedDistribution<T>(
  distribution: SampleParams<T>['distribution']
): distribution is WeightedValue<T>[] {
  const distributionKeys: ReturnType<typeof Object.keys> = Object.keys(
    distribution[0]
  )

  return isStrictZero(length(distributionKeys))
    ? false
    : distributionKeys.every(
        (key: string) => key === 'value' || key === 'weight'
      )
}
