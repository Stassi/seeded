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
        const possibleValues: unknown[] = distribution.map(
          <V extends unknown>({ value }: { value: V }): V => value
        )

        type ExpectedValues = typeof possibleValues[number]

        const count: SampleParams<ExpectedValues>['count'] = 5,
          seed: SampleParams<ExpectedValues>['seed'] = 'hello world',
          { generated, next }: Sample<ExpectedValues> = sample({
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
            const { generated: secondGenerated }: Sample<ExpectedValues> =
              next(count)
            expect(secondGenerated).toEqual(secondExpected)
          })
        })
      })
    }
  )
})
