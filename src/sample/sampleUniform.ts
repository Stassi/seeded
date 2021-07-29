import type { Number } from '../number'
import type { Sample, SampleUniformParams, Value } from './Samples'
import length from '../utilities/length'
import number from '../number'

export default function sampleUniform<T>({
  distribution,
  ...props
}: SampleUniformParams<T>): Sample<T> {
  const { generated, state }: Number = number({
    ...props,
    discrete: true,
    max: length(distribution),
  })

  return {
    state,
    generated: generated.map(
      (i: Number['generated'][number]): Value<T> => distribution[i]
    ),
  }
}
