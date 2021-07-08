import { Integer } from './integer'
import delayTen from './utilities/delayTen'
import integer from './integer'
import length from './utilities/length'
import maximumSafeBinary from './utilities/maximumSafeBinary'
import negate from './utilities/negate'

describe('integer', () => {
  describe.each([
    {
      expected: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
      ],
      max: 1,
      min: -0.9,
    },
    {
      expected: [
        [-1, -1, 0, -1, -1],
        [0, -1, -1, 0, 0],
      ],
      max: 1,
      min: -1,
    },
    {
      expected: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
      ],
      max: 1,
      min: 0,
    },
    {
      expected: [
        [0, 0, 1, 0, 0],
        [1, 0, 0, 1, 1],
      ],
      max: 2,
      min: 0,
    },
    {
      expected: [
        [0, 2, 4, 1, 2],
        [5, 1, 0, 4, 6],
      ],
      max: 8,
      min: 0,
    },
    {
      expected: [
        [
          429213476091897, 1301914878543128, 2786706481541730, 976053428009042,
          1582399419995796,
        ],
        [
          3099175663437328, 921365178165718, 273022197705261, 2353355207890545,
          3847802525837347,
        ],
      ],
      max: undefined,
      min: undefined,
    },
    {
      expected: [
        [
          429213476091897, 1301914878543128, 2786706481541730, 976053428009042,
          1582399419995796,
        ],
        [
          3099175663437328, 921365178165718, 273022197705261, 2353355207890545,
          3847802525837347,
        ],
      ],
      max: maximumSafeBinary,
      min: 0,
    },
    {
      expected: [
        [
          -4074386151278599, -3201684748827368, -1716893145828766,
          -3527546199361454, -2921200207374700,
        ],
        [
          -1404423963933168, -3582234449204778, -4230577429665235,
          -2150244419479951, -655797101533149,
        ],
      ],
      max: 0,
      min: negate(maximumSafeBinary),
    },
    {
      expected: [
        [
          -3645172675186702, -1899769870284240, 1069813335712964,
          -2551492771352412, -1338800787378904,
        ],
        [
          1694751699504160, -2660869271039060, -3957555231959974,
          203110788410594, 3192005424304198,
        ],
      ],
      max: maximumSafeBinary,
      min: negate(maximumSafeBinary),
    },
  ])(
    'range: [$min, $max)',
    ({
      max,
      min,
      expected: [firstExpected, secondExpected],
    }: {
      expected: number[][]
      max?: number
      min?: number
    }) => {
      describe(`deterministic`, () => {
        const seed: string = 'hello.',
          expected: number[] = [...firstExpected, ...secondExpected],
          firstExpectedLength: number = length(firstExpected),
          expectedLength: number = length(expected)

        describe('first chained call', () => {
          const { generated, next: nextInteger }: Integer = integer({
            max,
            min,
            seed,
            count: firstExpectedLength,
          })

          it('should persistently return known integers', () => {
            expect(generated).toEqual(firstExpected)
          })

          describe('second chained call', () => {
            it('should persistently return known integers', () => {
              const { generated: generatedTwo }: Integer =
                nextInteger(firstExpectedLength)
              expect(generatedTwo).toEqual(secondExpected)
            })
          })
        })

        describe('composite call', () => {
          it('should persistently return known integers', () => {
            const { generated }: Integer = integer({
              max,
              min,
              seed,
              count: expectedLength,
            })

            expect(generated).toEqual(expected)
          })
        })

        describe('state loading', () => {
          const { state }: Integer = integer({
              max,
              min,
              seed,
              count: firstExpectedLength,
            }),
            { generated }: Integer = integer({
              max,
              min,
              state,
              count: firstExpectedLength,
              drop: 0,
            })

          it('should return known integers from a loaded state', () => {
            expect(generated).toEqual(secondExpected)
          })
        })
      })

      describe(`stochastic`, () => {
        const stochasticPair = async (): Promise<[number, number]> => {
          const single = (): number => integer({ max, min }).generated[0]
          const x: number = single()
          await delayTen()
          const y: number = single()
          return [x, y]
        }

        describe('multiple instances', () => {
          it('should return discrete values within specified range', async () => {
            const [x, y]: [number, number] = await stochasticPair()
            expect(x).toBeGreaterThanOrEqual(min || 0)
            expect(x).toBeLessThan(max || maximumSafeBinary)
            expect(y).toBeGreaterThanOrEqual(min || 0)
            expect(y).toBeLessThan(max || maximumSafeBinary)
          })
        })
      })
    }
  )
})
