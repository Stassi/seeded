import type { Sample, SampleParams } from './sample'
import delayTen from './utilities/delayTen'
import { negate } from './arithmetic'
import { sample } from './index'
import { sampleWeightUnderflowErrorMessage } from './data'

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
        ['a', 'a', 'a', 'a', 0],
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
        [0, 0, true, true, true],
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

        describe('composite call', () => {
          const { generated }: ExpectedSample = sample({
              distribution,
              seed,
              count: count * 2,
            }),
            compositeExpected: Expected[] = [...expected, ...secondExpected]

          it('should persistently return known values', () => {
            expect(generated).toEqual(compositeExpected)
          })
        })

        describe('state loading', () => {
          const { state }: ExpectedSample = sample({
              count,
              distribution,
              seed,
            }),
            { generated }: ExpectedSample = sample({
              count,
              distribution,
              seed,
              state,
              drop: 0,
            })

          it('should return known values from a loaded state', () => {
            expect(generated).toEqual(secondExpected)
          })
        })
      })

      describe('stochastic', () => {
        const values: Value[] = distribution.map(
            ({ value }: { value: Value }): Value => value
          ),
          stochasticPair = async (): Promise<[Value, Value]> => {
            const generateOne = (): Value =>
                sample({ distribution }).generated[0],
              x: Value = generateOne()
            await delayTen()
            const y: Value = generateOne()
            return [x, y]
          }

        it('should return values within a specified sample distribution', async () => {
          expect(values).toEqual(expect.arrayContaining(await stochasticPair()))
        })
      })
    }
  )

  describe('weight underflow errors', () => {
    describe.each(
      [0, negate(1)].map(
        (weight: SampleParams<any>['distribution'][number]['weight']) => ({
          distribution: [{ weight, value: undefined }],
          expected: sampleWeightUnderflowErrorMessage,
        })
      )
    )(
      'distribution containing weight: $distribution.0.weight',
      <Value extends unknown>({
        distribution,
        expected,
      }: {
        distribution: SampleParams<Value>['distribution']
        expected: string
      }) => {
        it('should throw a weight underflow error', () => {
          expect(() => sample({ distribution })).toThrow(expected)
        })
      }
    )
  })
})
