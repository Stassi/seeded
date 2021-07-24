import type { CipherPersistent } from '../cipher'
import type { Sample, SampleParams } from './sample'
import length from '../utilities/length'
import number from '../number'
import { poolWidth } from '../data'

export interface QuickUniformSampleParams<T> {
  count?: SampleParams<T>['count']
  distribution: T[]
  drop?: SampleParams<T>['drop']
  seed?: SampleParams<T>['seed']
  state?: SampleParams<T>['state']
}

export type QuickUniformSample<T> = Sample<T>

export default function quickUniformSample<T>({
  distribution,
  ...props
}: QuickUniformSampleParams<T>): QuickUniformSample<T> {
  const totalWeight: number = length(distribution),
    weightOverflow: boolean = totalWeight > poolWidth,
    weightOverflowErrorMessage: string = `total weight must not exceed ${poolWidth}`

  if (weightOverflow) throw new RangeError(weightOverflowErrorMessage)

  const { state, generated: generatedNumber }: CipherPersistent = number({
      ...props,
      discrete: true,
      max: totalWeight,
    }),
    generated: QuickUniformSample<T>['generated'] = generatedNumber.map(
      (
        i: CipherPersistent['generated'][number]
      ): QuickUniformSample<T>['generated'][number] => distribution[i]
    )

  function next(
    count: QuickUniformSampleParams<T>['count']
  ): QuickUniformSample<T> {
    return quickUniformSample({
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
