import type { DivideByCallback } from '../arithmetic'
import type { Number } from '../number'
import type {
  Sample,
  SampleWeightedParams,
  Value,
  Weight,
  WeightedValue,
  WeightedValues,
} from './Samples'
import number from '../number'
import { sampleWeightUnderflowErrorMessage } from '../data'
import { add, divideBy, increment, negate, sum } from '../arithmetic'

function throwIfRangeUnderflowError<T>(distribution: WeightedValues<T>) {
  if (
    distribution.some(({ weight }: WeightedValue<T>): boolean => !(weight > 0))
  )
    throw new RangeError(sampleWeightUnderflowErrorMessage)
}

export default function sampleWeighted<T>({
  distribution,
  ...props
}: SampleWeightedParams<T>): Sample<T> {
  throwIfRangeUnderflowError(distribution)

  const divideByTotalWeight: DivideByCallback = divideBy(
      sum(...distribution.map(({ weight }: WeightedValue<T>): Weight => weight))
    ),
    weightedValues: WeightedValues<T> = distribution.sort(
      (
        { weight: prevWeight }: WeightedValue<T>,
        { weight }: WeightedValue<T>
      ): Weight => add(weight, negate(prevWeight))
    ),
    { generated, state }: Number = number({
      ...props,
      discrete: false,
    })

  return {
    state,
    generated: generated.map((generatedInterval: number): Value<T> => {
      let selected: Value<T> | undefined,
        isValueSelected: boolean = false,
        cumulativeWeight: Weight = 0,
        i: number = 0

      while (!isValueSelected) {
        const { value, weight }: WeightedValue<T> = weightedValues[i]

        cumulativeWeight = add(cumulativeWeight, weight)

        if (generatedInterval < divideByTotalWeight(cumulativeWeight)) {
          selected = value
          isValueSelected = true
        } else i = increment(i)
      }

      return <Value<T>>selected
    }),
  }
}
