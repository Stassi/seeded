import type { NumberParams } from '../number'
import type {
  Sample,
  SampleParams,
  SamplePersistent,
  WeightedValue,
} from './Samples'
import { isExpandedDistributionSyntax } from './Samples'
import sampleUniform from './sampleUniform'
import sampleWeighted from './sampleWeighted'
import { strictlyEqualsOne } from '../utilities/strictlyEquals'

export default function sample<T>({
  distribution,
  ...props
}: SampleParams<T>): SamplePersistent<T> {
  let generated: SamplePersistent<T>['generated']
  let state: SamplePersistent<T>['state']

  if (isExpandedDistributionSyntax(distribution)) {
    if (
      distribution.every(({ weight }: WeightedValue<T>) =>
        strictlyEqualsOne(weight)
      )
    ) {
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
      const { generated: prevGenerated, state: prevState }: Sample<T> =
        sampleWeighted({ ...props, distribution })

      generated = prevGenerated
      state = prevState
    }
  } else {
    const { generated: prevGenerated, state: prevState }: Sample<T> =
      sampleUniform({ ...props, distribution })

    generated = prevGenerated
    state = prevState
  }

  function next(count?: NumberParams['count']): SamplePersistent<T> {
    return sample({ ...props, count, distribution, state, drop: 0 })
  }

  return { generated, next, state }
}
