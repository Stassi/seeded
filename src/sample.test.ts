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
          value: 'a',
          weight: 1,
        },
        {
          value: true,
          weight: 1,
        },
      ],
      expected: [
        [0, true, 0, 'a', 'a'],
        ['a', 'a', 'a', 0, 0],
      ],
      name: 'uniform',
    },
    {
      distribution: [
        {
          value: 0,
          weight: 1,
        },
        {
          value: 'a',
          weight: 1,
        },
        {
          value: true,
          weight: 2,
        },
      ],
      expected: [
        [true, 'a', true, true, 0],
        [true, 0, 0, true, true],
      ],
      name: 'weighted',
    },
  ])(
    'distribution: $name',
    <Value extends unknown>({
      distribution,
      expected: [expected, secondExpected],
    }: {
      distribution: SampleParams<Value>['distribution']
      expected: Sample<Value>['generated'][]
      name: string
    }) => {
      describe('deterministic', () => {
        type Expected = Value[][number]
        type ExpectedSample = Sample<Expected>
        type ExpectedSampleParams = SampleParams<Expected>

        const count: ExpectedSampleParams['count'] = 5,
          seed: ExpectedSampleParams['seed'] = 'hello world',
          { generated, next }: ExpectedSample = sample({
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
            const { generated: secondGenerated }: ExpectedSample = next(count)
            expect(secondGenerated).toEqual(secondExpected)
          })
        })
      })
    }
  )
})
