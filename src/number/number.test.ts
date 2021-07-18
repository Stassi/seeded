import type { CipherPersistent } from '../cipher'
import delayTen from '../utilities/delayTen'
import length from '../utilities/length'
import { number } from '../index'
import {
  integerRangeUnderflowErrorMessage,
  intervalRangeUnderflowErrorMessage,
  maximumSafeBinary,
} from '../data'
import testCases from './testCases.json'

const { numberRange: numberRangeTestCases } = testCases

describe('number', () => {
  describe.each([
    ...numberRangeTestCases,
    {
      expected: {
        integer: [
          [
            429213476091897, 1301914878543128, 2786706481541730,
            976053428009042, 1582399419995796,
          ],
          [
            3099175663437328, 921365178165718, 273022197705261,
            2353355207890545, 3847802525837347,
          ],
        ],
        interval: [
          [
            429213476091897, 1301914878543128, 2786706481541730,
            976053428009042, 1582399419995796,
          ],
          [
            3099175663437328, 921365178165718, 273022197705261,
            2353355207890545, 3847802525837347,
          ],
        ],
      },
      max: maximumSafeBinary,
      min: 0,
    },
    {
      expected: {
        integer: [
          [
            4503599627370495, 4503599627370495, 4503599627370495,
            4503599627370495, 4503599627370495,
          ],
          [
            4503599627370495, 4503599627370495, 4503599627370495,
            4503599627370495, 4503599627370495,
          ],
        ],
        interval: [
          [
            4503599627370495, 4503599627370495.5, 4503599627370495.5,
            4503599627370495, 4503599627370495.5,
          ],
          [
            4503599627370495.5, 4503599627370495, 4503599627370495,
            4503599627370495.5, 4503599627370495.5,
          ],
        ],
      },
      max: maximumSafeBinary,
      min: maximumSafeBinary - 1,
    },
  ])(
    'range: [$min, $max)',
    ({
      expected,
      max,
      min,
    }: {
      expected: {
        integer: number[][]
        interval: number[][]
      }
      max?: number
      min?: number
    }) => {
      describe('deterministic', () => {
        const seed: string = 'hello.'

        describe.each([false, true])('discrete: %s', (discrete: boolean) => {
          const [firstExpected, secondExpected]: number[][] =
              expected[discrete ? 'integer' : 'interval'],
            compositeExpected: number[] = [...firstExpected, ...secondExpected],
            firstExpectedLength: number = length(firstExpected),
            compositeExpectedLength: number = length(compositeExpected)

          describe('first chained call', () => {
            const { generated, next }: CipherPersistent = number({
              discrete,
              max,
              min,
              seed,
              count: firstExpectedLength,
            })

            it('should persistently return known values', () => {
              expect(generated).toEqual(firstExpected)
            })

            describe('second chained call', () => {
              it('should persistently return known values', () => {
                const { generated: secondGenerated }: CipherPersistent =
                  next(firstExpectedLength)
                expect(secondGenerated).toEqual(secondExpected)
              })
            })
          })

          describe('composite call', () => {
            it('should persistently return known values', () => {
              const { generated }: CipherPersistent = number({
                discrete,
                max,
                min,
                seed,
                count: compositeExpectedLength,
              })

              expect(generated).toEqual(compositeExpected)
            })
          })

          describe('state loading', () => {
            const { state }: CipherPersistent = number({
                discrete,
                max,
                min,
                seed,
                count: firstExpectedLength,
              }),
              { generated }: CipherPersistent = number({
                discrete,
                max,
                min,
                state,
                count: firstExpectedLength,
                drop: 0,
              })

            it('should return known values from a loaded state', () => {
              expect(generated).toEqual(secondExpected)
            })
          })
        })
      })

      describe('stochastic', () => {
        describe.each([false, true])('discrete: %s', (discrete: boolean) => {
          const stochasticPair = async (): Promise<[number, number]> => {
            const generateOne = (): number =>
                number({ discrete, max, min }).generated[0],
              x: number = generateOne()
            await delayTen()
            const y: number = generateOne()
            return [x, y]
          }

          it('should return values within specified range', async () => {
            const [x, y]: [number, number] = await stochasticPair(),
              minOrDefaultMin = min || 0,
              maxOrDefaultMax = max || maximumSafeBinary - 1

            expect(x).toBeGreaterThanOrEqual(minOrDefaultMin)
            expect(x).toBeLessThanOrEqual(maxOrDefaultMax)
            expect(y).toBeGreaterThanOrEqual(minOrDefaultMin)
            expect(y).toBeLessThanOrEqual(maxOrDefaultMax)
          })
        })
      })
    }
  )

  describe('range underflow errors', () => {
    describe('discrete: false', () => {
      const discrete: boolean = false

      describe.each([
        { expected: intervalRangeUnderflowErrorMessage, max: 0, min: 0 },
        { expected: intervalRangeUnderflowErrorMessage, max: -1, min: 0 },
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
            expect(() =>
              number({ max, min, ...(discrete ? discrete : {}) })
            ).toThrow(expected)
          })
        }
      )

      describe.each([
        { expected: intervalRangeUnderflowErrorMessage, max: 1, min: 0.1 },
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
          it('should NOT throw a range error', () => {
            expect(() =>
              number({ max, min, ...(discrete ? discrete : {}) })
            ).not.toThrow(expected)
          })
        }
      )
    })

    describe('discrete: true', () => {
      const discrete: boolean = true

      describe.each([
        { expected: integerRangeUnderflowErrorMessage, max: 0, min: 0 },
        { expected: integerRangeUnderflowErrorMessage, max: -1, min: 0 },
        { expected: integerRangeUnderflowErrorMessage, max: 1, min: 0.1 },
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
            expect(() => number({ discrete, max, min })).toThrow(expected)
          })
        }
      )
    })
  })
})
