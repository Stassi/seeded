import type { Sample, SampleParams } from './sample'
import { sample } from './index'

describe('sample', () => {
  describe.each([
    {
      distribution: [
        {
          value: 0,
          weight: 1,
        },
        {
          value: 1,
          weight: 1,
        },
      ],
      expected: [
        [0, 1, 0, 0, 1],
        [0, 1, 1, 0, 0],
      ],
      name: 'binary uniform distribution',
    },
    {
      distribution: [
        {
          value: 0,
          weight: 1,
        },
        {
          value: 1,
          weight: 2,
        },
      ],
      expected: [
        [1, 0, 1, 1, 1],
        [1, 1, 1, 1, 1],
      ],
      name: 'binary weighted distribution',
    },
  ])(
    'distribution: $name',
    ({
      distribution,
      expected: [expected, secondExpected],
    }: {
      distribution: SampleParams<unknown>['distribution']
      expected: Sample<unknown>['generated'][]
      name: string
    }) => {
      describe('deterministic', () => {
        type Expected = typeof distribution[0]['value']

        const count: SampleParams<Expected>['count'] = 5,
          seed: SampleParams<Expected>['seed'] = 'hello world',
          { generated, next }: Sample<Expected> = sample({
            count,
            distribution,
            seed,
          })

        describe('first chained call', () => {
          it('should persistently return known values', () => {
            expect(generated).toEqual(expected)
          })
        })

        describe('second chained call', () => {
          it('should persistently return known values', () => {
            const { generated: secondGenerated }: Sample<Expected> = next(count)
            expect(secondGenerated).toEqual(secondExpected)
          })
        })
      })
    }
  )
})
