import type { Sample, SampleParams } from './sample'
import length from './utilities/length'
import { poolWidth } from './data'
import sample from './sample'

export interface QuickUniformSampleParams<T> {
  count?: SampleParams<T>['count']
  distribution: T[]
  drop?: SampleParams<T>['drop']
  seed?: SampleParams<T>['seed']
  state?: SampleParams<T>['state']
}

export type QuickUniformSample<T> = Sample<T>

export default function quickUniformSample<T>({
  distribution: prevDistribution,
  ...props
}: QuickUniformSampleParams<T>): QuickUniformSample<T> {
  if (length(prevDistribution) > poolWidth)
    throw new RangeError(`total weight must not exceed ${poolWidth}`)

  const distribution: SampleParams<T>['distribution'] = prevDistribution.map(
    (
      value: QuickUniformSampleParams<T>['distribution'][number]
    ): {
      weight: SampleParams<T>['distribution'][number]['weight']
      value: SampleParams<T>['distribution'][number]['value']
    } => ({
      value,
      weight: 1,
    })
  )

  return sample({ ...props, distribution })
}
