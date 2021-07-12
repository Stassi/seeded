import type { Cipher } from '../cipher'
import delayTen from '../utilities/delayTen'
import length from '../utilities/length'
import negate from '../utilities/negate'
import number from './number'
import {
  integerRangeUnderflowErrorMessage,
  intervalRangeUnderflowErrorMessage,
  maximumSafeBinary,
} from '../data'

describe('number', () => {
  describe.each([
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
            0.09530453672732464, 0.289083174852129, 0.6187731397359575,
            0.21672739780799022, 0.3513632540465652,
          ],
          [
            0.6881552357812133, 0.20458416697748794, 0.06062310602522847,
            0.522549827384321, 0.8543837916790913,
          ],
        ],
      },
      max: undefined,
      min: undefined,
    },
    {
      expected: {
        integer: [
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        interval: [
          [
            -0.7189213802180832, -0.350741967780955, 0.2756689654983192,
            -0.4882179441648186, -0.2324098173115261,
          ],
          [
            0.4074949479843052, -0.511290082742773, -0.7848160985520659,
            0.09284467203020985, 0.7233292041902734,
          ],
        ],
      },
      max: 1,
      min: negate(0.9),
    },
    {
      expected: {
        integer: [
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        interval: [
          [
            0.09530453672732464, 0.289083174852129, 0.6187731397359575,
            0.21672739780799022, 0.3513632540465652,
          ],
          [
            0.6881552357812133, 0.20458416697748794, 0.06062310602522847,
            0.522549827384321, 0.8543837916790913,
          ],
        ],
      },
      max: 1,
      min: 0,
    },
    {
      expected: {
        integer: [
          [1, 0, 0, 0, 0],
          [1, 1, 0, 0, 1],
        ],
        interval: [
          [
            0.19060907345464928, 0.578166349704258, 1.237546279471915,
            0.43345479561598044, 0.7027265080931304,
          ],
          [
            1.3763104715624266, 0.40916833395497587, 0.12124621205045694,
            1.045099654768642, 1.7087675833581826,
          ],
        ],
      },
      max: 2,
      min: 0,
    },
  ])(
    'range: [$min, $max)',
    ({
      max,
      min,
      expected: {
        integer: [firstExpected, secondExpected],
        interval: [firstExpectedInterval, secondExpectedInterval],
      },
    }: {
      expected: {
        integer: number[][]
        interval: number[][]
      }
      max?: number
      min?: number
    }) => {
      describe('deterministic', () => {
        const seed: string = 'hello.',
          expected: number[] = [...firstExpected, ...secondExpected],
          expectedInterval: number[] = [
            ...firstExpectedInterval,
            ...secondExpectedInterval,
          ],
          firstExpectedLength: number = length(firstExpected),
          expectedLength: number = length(expected)

        describe('integer', () => {
          const discrete: boolean = true

          describe('first chained call', () => {
            const { generated, next: nextInteger }: Cipher = number({
              discrete,
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
              const { generated }: Cipher = number({
                discrete,
                max,
                min,
                seed,
                count: expectedLength,
              })

              expect(generated).toEqual(expected)
            })
          })

          describe('state loading', () => {
            const { state }: Cipher = number({
                discrete,
                max,
                min,
                seed,
                count: firstExpectedLength,
              }),
              { generated }: Cipher = number({
                discrete,
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

        describe('interval', () => {
          const discrete: boolean = false

          describe('first chained call', () => {
            const { generated, next: nextInteger }: Cipher = number({
              discrete,
              max,
              min,
              seed,
              count: firstExpectedLength,
            })

            it('should persistently return known intervals', () => {
              expect(generated).toEqual(firstExpectedInterval)
            })

            describe('second chained call', () => {
              it('should persistently return known intervals', () => {
                const { generated: generatedTwo }: Cipher =
                  nextInteger(firstExpectedLength)
                expect(generatedTwo).toEqual(secondExpectedInterval)
              })
            })
          })

          describe('composite call', () => {
            it('should persistently return known intervals', () => {
              const { generated }: Cipher = number({
                discrete,
                max,
                min,
                seed,
                count: expectedLength,
              })

              expect(generated).toEqual(expectedInterval)
            })
          })

          describe('state loading', () => {
            const { state }: Cipher = number({
                discrete,
                max,
                min,
                seed,
                count: firstExpectedLength,
              }),
              { generated }: Cipher = number({
                discrete,
                max,
                min,
                state,
                count: firstExpectedLength,
                drop: 0,
              })

            it('should return known intervals from a loaded state', () => {
              expect(generated).toEqual(secondExpectedInterval)
            })
          })
        })
      })

      describe('stochastic', () => {
        describe('integer', () => {
          const discrete: boolean = true,
            stochasticPair = async (): Promise<[number, number]> => {
              const single = (): number =>
                number({ discrete, max, min }).generated[0]
              const x: number = single()
              await delayTen()
              const y: number = single()
              return [x, y]
            }

          it('should return discrete values within specified range', async () => {
            const [x, y]: [number, number] = await stochasticPair()
            expect(x).toBeGreaterThanOrEqual(min || 0)
            expect(x).toBeLessThanOrEqual(max || maximumSafeBinary - 1)
            expect(y).toBeGreaterThanOrEqual(min || 0)
            expect(y).toBeLessThanOrEqual(max || maximumSafeBinary - 1)
          })
        })

        describe('interval', () => {
          const discrete: boolean = false,
            stochasticPair = async (): Promise<[number, number]> => {
              const single = (): number =>
                number({ discrete, max, min }).generated[0]
              const x: number = single()
              await delayTen()
              const y: number = single()
              return [x, y]
            }

          it('should return discrete values within specified range', async () => {
            const [x, y]: [number, number] = await stochasticPair()
            expect(x).toBeGreaterThanOrEqual(min || 0)
            expect(x).toBeLessThanOrEqual(max || maximumSafeBinary - 1)
            expect(y).toBeGreaterThanOrEqual(min || 0)
            expect(y).toBeLessThanOrEqual(max || maximumSafeBinary - 1)
          })
        })
      })
    }
  )

  describe('range underflow errors', () => {
    describe('integer', () => {
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

    describe('interval', () => {
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
  })
})
