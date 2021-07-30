import type { Number } from '../number'
import type { N, NumberCallback } from '../utilities/numbers'
import type {
  Sample,
  SampleWeightedParams,
  Value,
  Weight,
  WeightedValue,
  WeightedValues,
} from './Samples'
import not from '../utilities/not'
import number from '../number'
import { throwIfRangeUnderflowError } from './Samples'
import { add, divideBy, increment, negate, sum } from '../arithmetic'

export default function sampleWeighted<T>({
  distribution,
  ...props
}: SampleWeightedParams<T>): Sample<T> {
  throwIfRangeUnderflowError(distribution)

  const divideByTotalWeight: NumberCallback = divideBy(
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
    generated: generated.map((generatedInterval: N): Value<T> => {
      let selected: Value<T> | undefined,
        isValueSelected: boolean = false,
        cumulativeWeight: Weight = 0,
        i: N = 0

      while (not(isValueSelected)) {
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
