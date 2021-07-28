import type { NumberParams } from '../number'
import type {
  Sample,
  SampleParams,
  SamplePersistent,
  WeightedValue,
} from './Samples'
import { expandedDistribution } from './Samples'
import sampleUniform from './sampleUniform'
import sampleWeighted from './sampleWeighted'

export default function sample<T>({
  distribution,
  ...props
}: SampleParams<T>): SamplePersistent<T> {
  let generated: SamplePersistent<T>['generated']
  let state: SamplePersistent<T>['state']

  if (expandedDistribution(distribution)) {
    if (distribution.every(({ weight }: WeightedValue<T>) => weight === 1)) {
      const { generated: prevGenerated, state: prevState }: Sample<T> =
        sampleUniform({
          ...props,
          distribution: distribution.map(
            ({ value }: WeightedValue<T>): T => value
          ),
        })

      generated = prevGenerated
      state = prevState
    } else {
      const {
        generated: prevGenerated,
        state: prevState,
      }: SamplePersistent<T> = sampleWeighted({ ...props, distribution })

      generated = prevGenerated
      state = prevState
    }
  } else {
    const { generated: prevGenerated, state: prevState }: Sample<T> =
      sampleUniform({ ...props, distribution: <T[]>distribution })

    generated = prevGenerated
    state = prevState
  }

  function next(count?: NumberParams['count']): SamplePersistent<T> {
    return sample({ ...props, count, distribution, state, drop: 0 })
  }

  return { generated, next, state }
}
