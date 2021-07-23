import type { DivideByCallback } from './arithmetic'
import type {
  CipherParams,
  CipherParamsOptional,
  CipherPersistent,
} from './cipher'
import number from './number'
import { add, divideBy, increment, negate, sum } from './arithmetic'

interface WeightedValue<T> {
  value: T
  weight: number
}

export interface SampleParams<T> {
  count?: CipherParamsOptional['count']
  distribution: WeightedValue<T>[]
  drop?: CipherParamsOptional['drop']
  seed?: CipherParamsOptional['seed']
  state?: CipherParamsOptional['state']
}

export interface Sample<T> {
  generated: WeightedValue<T>['value'][]
  next: (count?: SampleParams<T>['count']) => Sample<T>
  state: CipherParams['state']
}

export default function sample<T>({
  distribution,
  ...props
}: SampleParams<T>): Sample<T> {
  const divideByTotalWeight: DivideByCallback = divideBy(
      sum(
        ...distribution.map(
          ({ weight }: WeightedValue<T>): WeightedValue<T>['weight'] => weight
        )
      )
    ),
    weightedValues: SampleParams<T>['distribution'] = distribution.sort(
      (
        { weight: prevWeight }: WeightedValue<T>,
        { weight }: WeightedValue<T>
      ): WeightedValue<T>['weight'] => add(weight, negate(prevWeight))
    ),
    { state, generated: generatedIntervals }: CipherPersistent = number({
      ...props,
      discrete: false,
    }),
    generated: Sample<T>['generated'] = generatedIntervals.map(
      (generatedInterval: number): WeightedValue<T>['value'] => {
        let selected: WeightedValue<T>['value'] | undefined,
          isValueSelected: boolean = false,
          cumulativeWeight: WeightedValue<T>['weight'] = 0,
          i: number = 0

        while (!isValueSelected) {
          const { value, weight }: WeightedValue<T> = weightedValues[i]

          cumulativeWeight = add(cumulativeWeight, weight)

          if (generatedInterval < divideByTotalWeight(cumulativeWeight)) {
            selected = value
            isValueSelected = true
          } else i = increment(i)
        }

        return <WeightedValue<T>['value']>selected
      }
    )

  function next(count: SampleParams<T>['count'] = 1): Sample<T> {
    return sample({
      ...props,
      count,
      distribution,
      state,
      drop: 0,
    })
  }

  return {
    generated,
    next,
    state,
  }
}
