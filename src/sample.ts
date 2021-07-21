import type { DivideByCallback } from './arithmetic'
import type {
  CipherParams,
  CipherParamsOptional,
  CipherPersistent,
} from './cipher'
import number from './number'
import { add, divideBy, increment, negate, sum } from './arithmetic'

interface SampleDistributionElement<T> {
  value: T
  weight: number
}

export interface SampleParams<T> {
  count?: CipherParamsOptional['count']
  distribution: SampleDistributionElement<T>[]
  seed?: CipherParamsOptional['seed']
  state?: CipherParamsOptional['state']
}

export interface Sample<T> {
  generated: T[]
  next: (count?: SampleParams<T>['count']) => Sample<T>
  state: CipherParams['state']
}

export default function sample<T>({
  distribution,
  ...props
}: SampleParams<T>): Sample<T> {
  const totalWeight: SampleDistributionElement<T>['weight'] = sum(
    ...distribution.map(({ weight }) => weight)
  )
  const divideByTotalWeight: DivideByCallback = divideBy(totalWeight)

  const descendingProbabilities: SampleParams<T>['distribution'] =
    distribution.sort(
      (
        { weight: prevWeight }: SampleDistributionElement<T>,
        { weight }: SampleDistributionElement<T>
      ): SampleDistributionElement<T>['weight'] =>
        add(weight, negate(prevWeight))
    )

  const { state, generated: generatedIntervals }: CipherPersistent = number({
    ...props,
    discrete: false,
  })

  const generated: Sample<T>['generated'] = generatedIntervals.map(
    (generatedInterval: number): T => {
      let selected: T | undefined,
        isValueSelected: boolean = false,
        cumulativeWeight: SampleDistributionElement<T>['weight'] = 0,
        i: number = 0

      while (!isValueSelected) {
        const descendingProbabilityElement: SampleDistributionElement<T> =
            descendingProbabilities[i],
          { value, weight }: SampleDistributionElement<T> =
            descendingProbabilityElement

        cumulativeWeight = add(cumulativeWeight, weight)

        if (generatedInterval < divideByTotalWeight(cumulativeWeight)) {
          selected = value
          isValueSelected = true
        } else i = increment(i)
      }

      return <T>selected
    }
  )

  function next(newCount: SampleParams<T>['count'] = 1): Sample<T> {
    return sample({
      ...props,
      distribution,
      state,
      count: newCount,
    })
  }

  return {
    generated,
    next,
    state,
  }
}
