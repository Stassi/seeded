import type { Number, NumberParams } from '../number'
import type { Sample, SampleParams, WeightedValue } from './Samples'
import isStrictZero from '../utilities/isStrictZero'
import length from '../utilities/length'
import number from '../number'
import sampleWeighted from './sampleWeighted'

type SampleUniform<T> = Pick<Sample<T>, 'generated' | 'state'>

export function expandedDistribution<T>(
  distribution: SampleParams<T>['distribution']
): distribution is WeightedValue<T>[] {
  const distributionKeys: ReturnType<typeof Object.keys> = Object.keys(
    distribution[0]
  )

  return isStrictZero(length(distributionKeys))
    ? false
    : distributionKeys.every(
        (key: string) => key === 'value' || key === 'weight'
      )
}

function sampleUniform<T>({
  distribution,
  ...props
}: SampleParams<T>): SampleUniform<T> {
  const { state, generated: generatedNumber }: Number = number({
      ...props,
      discrete: true,
      max: length(distribution),
    }),
    generated: T[] = generatedNumber.map(
      (i: Number['generated'][number]): T => <T>distribution[i]
    )

  return { generated, state }
}

export default function sample<T>({
  distribution,
  ...props
}: SampleParams<T>): Sample<T> {
  let generated: Sample<T>['generated']
  let state: Sample<T>['state']

  if (expandedDistribution(distribution)) {
    if (distribution.every(({ weight }: WeightedValue<T>) => weight === 1)) {
      const { generated: prevGenerated, state: prevState }: SampleUniform<T> =
        sampleUniform({
          ...props,
          distribution: distribution.map(
            ({ value }: WeightedValue<T>): T => value
          ),
        })

      generated = prevGenerated
      state = prevState
    } else {
      const { generated: prevGenerated, state: prevState }: Sample<T> =
        sampleWeighted({ ...props, distribution })

      generated = prevGenerated
      state = prevState
    }
  } else {
    const { generated: prevGenerated, state: prevState }: SampleUniform<T> =
      sampleUniform({ ...props, distribution })

    generated = prevGenerated
    state = prevState
  }

  function next(count?: NumberParams['count']): Sample<T> {
    return sample({ ...props, count, distribution, state, drop: 0 })
  }

  return { generated, next, state }
}
