import type { Sample, SampleParams } from './sample'
import { sample } from './index'

describe('sample', () => {
  describe('deterministic', () => {
    const count: SampleParams['count'] = 5,
      distribution: SampleParams['distribution'] = [
        {
          value: 0,
          weight: 1,
        },
        {
          value: 1,
          weight: 2,
        },
      ],
      expected: Sample['generated'] = [1, 0, 1, 1, 1],
      secondExpected: Sample['generated'] = [0, 1, 2, 3, 4],
      seed: SampleParams['seed'] = 'hello world'

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
