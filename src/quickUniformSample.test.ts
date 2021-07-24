import type {
  QuickUniformSample,
  QuickUniformSampleParams,
} from './quickUniformSample'
import delayTen from './utilities/delayTen'
import { negate } from './arithmetic'
import quickUniformSample from './quickUniformSample'
import { sampleWeightUnderflowErrorMessage } from './data'

describe('sample (quick uniform)', () => {
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
      distribution: QuickUniformSampleParams<Value>['distribution']
      expected: QuickUniformSample<Value>['generated'][]
      name: string
    }) => {
      describe('deterministic', () => {
        type Expected = Value[][number]
        type ExpectedSample = QuickUniformSample<Expected>
        type ExpectedSampleParams = QuickUniformSampleParams<Expected>

        const count: ExpectedSampleParams['count'] = 5,
          seed: ExpectedSampleParams['seed'] = 'hello world',
          { generated, next }: ExpectedSample = quickUniformSample({
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
          const { generated }: ExpectedSample = quickUniformSample({
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
          const { state }: ExpectedSample = quickUniformSample({
              count,
              distribution,
              seed,
            }),
            { generated }: ExpectedSample = quickUniformSample({
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
                quickUniformSample({ distribution }).generated[0],
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
        (
          weight: QuickUniformSampleParams<any>['distribution'][number]['weight']
        ) => ({
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
        distribution: QuickUniformSampleParams<Value>['distribution']
        expected: string
      }) => {
        it('should throw a weight underflow error', () => {
          expect(() => quickUniformSample({ distribution })).toThrow(expected)
        })
      }
    )
  })
})
