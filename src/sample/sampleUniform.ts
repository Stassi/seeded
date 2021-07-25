import type {
  CipherPersistent,
  SampleUniform,
  SampleUniformParams,
} from '../cipher'
import length from '../utilities/length'
import number from '../number'
import { poolWidth } from '../data'

export default function sampleUniform<T>({
  distribution,
  ...props
}: SampleUniformParams<T>): SampleUniform<T> {
  const totalWeight: number = length(distribution),
    weightOverflow: boolean = totalWeight > poolWidth,
    weightOverflowErrorMessage: string = `total weight must not exceed ${poolWidth}`

  if (weightOverflow) throw new RangeError(weightOverflowErrorMessage)

  const { state, generated: generatedNumber }: CipherPersistent = number({
      ...props,
      discrete: true,
      max: totalWeight,
    }),
    generated: SampleUniform<T>['generated'] = generatedNumber.map(
      (
        i: CipherPersistent['generated'][number]
      ): SampleUniform<T>['generated'][number] => distribution[i]
    )

  function next(count: SampleUniformParams<T>['count'] = 1): SampleUniform<T> {
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
