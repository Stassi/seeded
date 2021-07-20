import type { DivideByCallback } from './arithmetic'
import type { CipherParamsOptional, CipherPersistent } from './cipher'
import numberModule from './number'
import { add, divideBy, increment, negate, sum } from './arithmetic'

interface SampleDistributionElement {
  value: any
  weight: number
}

type SampleDistribution = SampleDistributionElement[]

export interface SampleParams extends CipherParamsOptional {
  distribution: SampleDistribution
}

export interface Sample extends CipherPersistent {
  generated: any[]
}

export default function sample({
  distribution,
  ...props
}: SampleParams): Sample {
  const totalWeight: SampleDistributionElement['weight'] = sum(
    ...distribution.map(({ weight }) => weight)
  )
  const divideByTotalWeight: DivideByCallback = divideBy(totalWeight)

  const descendingProbabilities: SampleDistribution = distribution.sort(
    (
      { weight: prevWeight }: SampleDistributionElement,
      { weight }: SampleDistributionElement
    ): SampleDistributionElement['weight'] => {
      return add(weight, negate(prevWeight))
    }
  )

  const {
    next,
    state,
    generated: generatedIntervals,
  }: CipherPersistent = numberModule({
    ...props,
    discrete: false,
  })

  const generated: Sample['generated'] = generatedIntervals.map(
    (generatedInterval: number): number => {
      let selected: any | undefined,
        isValueSelected: boolean = false,
        cumulativeWeight: SampleDistributionElement['weight'] = 0,
        i: number = 0

      while (!isValueSelected) {
        const descendingProbabilityElement: SampleDistributionElement =
            descendingProbabilities[i],
          { value, weight }: SampleDistributionElement =
            descendingProbabilityElement

        cumulativeWeight = add(cumulativeWeight, weight)

        if (generatedInterval < divideByTotalWeight(cumulativeWeight)) {
          selected = value
          isValueSelected = true
        } else {
          i = increment(i)
        }
      }

      return selected
    }
  )

  return {
    generated,
    next,
    state,
  }
}
