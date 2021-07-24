import type {
  QuickUniformSample,
  QuickUniformSampleParams,
} from './quickUniformSample'
import delayTen from './utilities/delayTen'
import identityPermutation from './utilities/identityPermutation'
import { increment } from './arithmetic'
import { poolWidth } from './data'
import quickUniformSample from './quickUniformSample'

describe('sample (quick uniform)', () => {
  type Value = boolean | number | string

  const distribution: Value[] = [0, 'a', true],
    [expected, secondExpected]: [Value[], Value[]] = [
      [0, true, 0, 'a', 'a'],
      ['a', 'a', 'a', 'a', 0],
    ]

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
    const stochasticPair = async (): Promise<[Value, Value]> => {
      const generateOne = (): Value =>
          quickUniformSample({ distribution }).generated[0],
        x: Value = generateOne()
      await delayTen()
      const y: Value = generateOne()
      return [x, y]
    }

    it('should return values within a specified sample distribution', async () => {
      expect(distribution).toEqual(
        expect.arrayContaining(await stochasticPair())
      )
    })
  })

  describe('weight overflow errors', () => {
    describe(`${increment(poolWidth)}-length distribution`, () => {
      it('should throw a (temporary) weight overflow error', () => {
        expect(() =>
          quickUniformSample({
            distribution: identityPermutation(increment(poolWidth)),
          })
        ).toThrow(`total weight must not exceed ${poolWidth}`)
      })
    })
  })
})
