import type { DivideByCallback } from '../arithmetic'
import type { Number } from '../number'
import type {
  Sample,
  SampleWeightedParams,
  WeightedValue,
  WeightedValues,
} from './Samples'
import isStrictZero from '../utilities/isStrictZero'
import number from '../number'
import { sampleWeightUnderflowErrorMessage } from '../data'
import { add, divideBy, increment, negate, sum } from '../arithmetic'

function throwIfRangeUnderflowError<T>(distribution: WeightedValues<T>) {
  distribution.forEach(({ weight }: WeightedValue<T>): void => {
    if (isStrictZero(weight) || weight < 0)
      throw new RangeError(sampleWeightUnderflowErrorMessage)
  })
}

export default function sampleWeighted<T>({
  distribution,
  ...props
}: SampleWeightedParams<T>): Sample<T> {
  throwIfRangeUnderflowError(distribution)

  const divideByTotalWeight: DivideByCallback = divideBy(
      sum(
        ...distribution.map(
          ({ weight }: WeightedValue<T>): WeightedValue<T>['weight'] => weight
        )
      )
    ),
    weightedValues: SampleWeightedParams<T>['distribution'] = distribution.sort(
      (
        { weight: prevWeight }: WeightedValue<T>,
        { weight }: WeightedValue<T>
      ): WeightedValue<T>['weight'] => add(weight, negate(prevWeight))
    ),
    { state, generated: generatedIntervals }: Number = number({
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

  return { generated, state }
}
