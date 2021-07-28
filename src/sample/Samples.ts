import type { NumberParams } from '../number'
import isStrictZero from '../utilities/isStrictZero'
import length from '../utilities/length'

type Values<T> = T[]

export interface WeightedValue<T> {
  value: T
  weight: number
}

export type WeightedValues<T> = WeightedValue<T>[]

type SampleNumberParams = Pick<
  NumberParams,
  'count' | 'drop' | 'seed' | 'state'
>

export interface SampleUniformParams<T> extends SampleNumberParams {
  distribution: Values<T>
}

export interface SampleWeightedParams<T> extends SampleNumberParams {
  distribution: WeightedValues<T>
}

export interface SampleParams<T> extends SampleNumberParams {
  distribution: Values<T> | WeightedValues<T>
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
): distribution is WeightedValues<T> {
  const distributionKeys: ReturnType<typeof Object.keys> = Object.keys(
    distribution[0]
  )

  return isStrictZero(length(distributionKeys))
    ? false
    : distributionKeys.every(
        (key: string) => key === 'value' || key === 'weight'
      )
}
