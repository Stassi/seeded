import type { Number } from '../number'
import type { Sample, SampleUniformParams } from './Samples'
import length from '../utilities/length'
import number from '../number'

export default function sampleUniform<T>({
  distribution,
  ...props
}: SampleUniformParams<T>): Sample<T> {
  const { state, generated: generatedNumber }: Number = number({
      ...props,
      discrete: true,
      max: length(distribution),
    }),
    generated: Sample<T>['generated'] = generatedNumber.map(
      (i: Number['generated'][number]): Sample<T>['generated'][number] =>
        distribution[i]
    )

  function next(count: SampleUniformParams<T>['count'] = 1): Sample<T> {
    return sampleUniform({
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
