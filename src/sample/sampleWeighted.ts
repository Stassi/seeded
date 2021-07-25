import type { DivideByCallback } from '../arithmetic'
import type { CipherPersistent, Sample, SampleParams } from '../cipher'
import isStrictZero from '../utilities/isStrictZero'
import number from '../number'
import { sampleWeightUnderflowErrorMessage } from '../data'
import { add, divideBy, increment, negate, sum } from '../arithmetic'

type WeightedValue<T> = SampleParams<T>['distribution'][number]

function throwIfRangeUnderflowError<T>(distribution: WeightedValue<T>[]) {
  distribution.forEach(({ weight }: WeightedValue<T>): void => {
    if (isStrictZero(weight) || weight < 0)
      throw new RangeError(sampleWeightUnderflowErrorMessage)
  })
}

export default function sampleWeighted<T>({
  distribution,
  ...props
}: SampleParams<T>): Sample<T> {
  throwIfRangeUnderflowError(distribution)

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
    return sampleWeighted({
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