import type { NumberParams } from '../number'
import head from '../utilities/head'
import { isStrictZero } from '../utilities/isStrict'
import length from '../utilities/length'
import { sampleWeightUnderflowErrorMessage } from '../data'

export type Value<T> = T
type Values<T> = Value<T>[]

export type Weight = number

export interface WeightedValue<T> {
  value: Value<T>
  weight: Weight
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

export function isExpandedDistributionSyntax<T>(
  distribution: SampleParams<T>['distribution']
): distribution is WeightedValues<T> {
  const distributionKeys: ReturnType<typeof Object.keys> = Object.keys(
    head(<Values<T>>distribution)
  )

  return isStrictZero(length(distributionKeys))
    ? false
    : distributionKeys.every(
        (key: string): boolean => key === 'value' || key === 'weight'
      )
}

export function throwIfRangeUnderflowError<T>(distribution: WeightedValues<T>) {
  if (
    distribution.some(({ weight }: WeightedValue<T>): boolean => !(weight > 0))
  )
    throw new RangeError(sampleWeightUnderflowErrorMessage)
}
