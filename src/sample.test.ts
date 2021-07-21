import type { Sample, SampleParams } from './sample'
import { sample } from './index'

type SampleNumber = Sample<number>
type SampleNumberParams = SampleParams<number>

describe('sample', () => {
  describe('deterministic', () => {
    const count: SampleNumberParams['count'] = 5,
      distribution: SampleNumberParams['distribution'] = [
        {
          value: 0,
          weight: 1,
        },
        {
          value: 1,
          weight: 2,
        },
      ],
      expected: SampleNumber['generated'] = [1, 0, 1, 1, 1],
      secondExpected: SampleNumber['generated'] = [1, 1, 1, 1, 1],
      seed: SampleNumberParams['seed'] = 'hello world'

    const { generated, next } = sample({ count, distribution, seed })

    describe('first call', () => {
      it('should return a known sample', () => {
        expect(generated).toEqual(expected)
      })
    })

    describe('second call', () => {
      it('should return the next known sample', () => {
        const { generated: secondGenerated } = next(count)
        expect(secondGenerated).toEqual(secondExpected)
      })
    })
  })
})
