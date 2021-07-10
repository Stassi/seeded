import type { Cipher } from './cipher'
import delayTen from './utilities/delayTen'
import integer from './integer'
import length from './utilities/length'
import maximumSafeBinary from './utilities/maximumSafeBinary'
import negate from './utilities/negate'
import { rangeUnderflowErrorMsg } from './octet'
import { bitsInOctet, poolWidth } from './integers.json'

describe('integer', () => {
  describe.each([
    {
      expected: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
      ],
      max: 1,
      min: negate(0.9),
    },
    {
      expected: [
        [1, 0, 0, 0, 0],
        [1, 1, 0, 0, 1],
      ],
      max: 1.9,
      min: negate(0.9),
    },
    {
      expected: [
        [1, 0, 0, 0, 0],
        [1, 1, 0, 0, 1],
      ],
      max: 2,
      min: 0,
    },
    {
      expected: [
        [1, 1, 0, -1, -1],
        [1, -1, 1, 0, -1],
      ],
      max: 2,
      min: negate(1),
    },
    {
      expected: [
        [113, 134, 94, 12, 198],
        [119, 249, 116, 160, 21],
      ],
      max: undefined,
      min: undefined,
    },
    {
      expected: [
        [113, 134, 94, 12, 198],
        [119, 249, 116, 160, 21],
      ],
      max: poolWidth,
      min: 0,
    },
    {
      expected: [
        [23, 73, 158, 54, 89],
        [175, 51, 14, 133, 218],
      ],
      max: poolWidth,
      min: -1,
    },
    {
      expected: [
        [24, 74, 159, 55, 90],
        [176, 52, 15, 134, 219],
      ],
      max: poolWidth + 1,
      min: 0,
    },
    {
      expected: [
        [1, 6, 6, 4, 6],
        [7, 1, 4, 0, 5],
      ],
      max: bitsInOctet,
      min: 0,
    },
    {
      expected: [
        [-7, -2, -2, -4, -2],
        [-1, -7, -4, -8, -3],
      ],
      max: 0,
      min: negate(bitsInOctet),
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
          const { generated, next: nextInteger }: Cipher = integer({
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
              const { generated: generatedTwo }: Cipher =
                nextInteger(firstExpectedLength)
              expect(generatedTwo).toEqual(secondExpected)
            })
          })
        })

        describe('composite call', () => {
          it('should persistently return known integers', () => {
            const { generated }: Cipher = integer({
              max,
              min,
              seed,
              count: expectedLength,
            })

            expect(generated).toEqual(expected)
          })
        })

        describe('state loading', () => {
          const { state }: Cipher = integer({
              max,
              min,
              seed,
              count: firstExpectedLength,
            }),
            { generated }: Cipher = integer({
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
            expect(x).toBeLessThanOrEqual(max || poolWidth - 1)
            expect(y).toBeGreaterThanOrEqual(min || 0)
            expect(y).toBeLessThanOrEqual(max || poolWidth - 1)
          })
        })
      })
    }
  )

  describe('range underflow errors', () => {
    describe.each([
      { expected: rangeUnderflowErrorMsg, max: 0, min: 0 },
      { expected: rangeUnderflowErrorMsg, max: -1, min: 0 },
      { expected: rangeUnderflowErrorMsg, max: 1, min: 0.1 },
    ])(
      'range: [$min, $max)',
      ({
        expected,
        max,
        min,
      }: {
        expected: string
        max: number
        min: number
      }) => {
        it('should throw a range error', () => {
          expect(() => integer({ max, min })).toThrow(expected)
        })
      }
    )
  })
})
