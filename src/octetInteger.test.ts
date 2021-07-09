import type { OctetInteger } from './octetInteger'
import delayTen from './utilities/delayTen'
import length from './utilities/length'
import negate from './utilities/negate'
import octetInteger from './octetInteger'
import { rangeOverflowErrorMsg } from './octet/octet'
import { bitsInOctet, poolWidth } from './integers.json'

describe('octetInteger', () => {
  describe.each([
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
          const { generated, next: nextInteger }: OctetInteger = octetInteger({
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
              const { generated: generatedTwo }: OctetInteger =
                nextInteger(firstExpectedLength)
              expect(generatedTwo).toEqual(secondExpected)
            })
          })
        })

        describe('composite call', () => {
          it('should persistently return known integers', () => {
            const { generated }: OctetInteger = octetInteger({
              max,
              min,
              seed,
              count: expectedLength,
            })

            expect(generated).toEqual(expected)
          })
        })

        describe('state loading', () => {
          const { state }: OctetInteger = octetInteger({
              max,
              min,
              seed,
              count: firstExpectedLength,
            }),
            { generated }: OctetInteger = octetInteger({
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
          const single = (): number => octetInteger({ max, min }).generated[0]
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

  describe('range errors', () => {
    describe.each([
      { expected: rangeOverflowErrorMsg, max: 256, min: -1 },
      { expected: rangeOverflowErrorMsg, max: 257, min: 0 },
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
        it('should not throw a range error', () => {
          expect(() => octetInteger({ max, min })).not.toThrow(expected)
        })
      }
    )
  })
})
