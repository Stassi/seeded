import type { Callback } from '../utilities/Callback'
import type { NumberParams } from '../number'
import head from '../utilities/head'
import length from '../utilities/length'
import { sampleWeightUnderflowErrorMessage } from '../data'
import strictlyEquals, { strictlyEqualsZero } from '../utilities/strictlyEquals'

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

  return strictlyEqualsZero(length(distributionKeys))
    ? false
    : distributionKeys.every((key: string): boolean => {
        const strictlyEqualsKey: Callback<typeof key, boolean> =
          strictlyEquals(key)

        return strictlyEqualsKey('value') || strictlyEqualsKey('weight')
      })
}

export function throwIfRangeUnderflowError<T>(distribution: WeightedValues<T>) {
  if (
    distribution.some(({ weight }: WeightedValue<T>): boolean => !(weight > 0))
  )
    throw new RangeError(sampleWeightUnderflowErrorMessage)
}
