import type { Sample, SampleUniformParams } from './Samples'
import length from '../utilities/length'
import number, { Number } from '../number'

export default function sampleUniform<T>({
  distribution,
  ...props
}: SampleUniformParams<T>): Sample<T> {
  const { state, generated: generatedNumber }: Number = number({
      ...props,
      discrete: true,
      max: length(distribution),
    }),
    generated: T[] = generatedNumber.map(
      (i: Number['generated'][number]): T => distribution[i]
    )

  return { generated, state }
}
