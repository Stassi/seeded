import type { Octet } from './octet'
import delayTen from '../utilities/delayTen'
import length from '../utilities/length'
import octet from './octet'
import { poolWidth } from '../integers.json'

describe('octet', () => {
  describe.each([
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
      max: 256,
      min: 0,
    },
    {
      expected: [
        [1, 6, 6, 4, 6],
        [7, 1, 4, 0, 5],
      ],
      max: 8,
      min: 0,
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
          const { generated, next: nextOctet }: Octet = octet({
            max,
            min,
            seed,
            count: firstExpectedLength,
          })

          it('should persistently return known octets', () => {
            expect(generated).toEqual(firstExpected)
          })

          describe('second chained call', () => {
            it('should persistently return known octets', () => {
              const { generated: generatedTwo }: Octet =
                nextOctet(firstExpectedLength)
              expect(generatedTwo).toEqual(secondExpected)
            })
          })
        })

        describe('composite call', () => {
          it('should persistently return known octets', () => {
            const { generated }: Octet = octet({
              max,
              min,
              seed,
              count: expectedLength,
            })

            expect(generated).toEqual(expected)
          })
        })

        describe('state loading', () => {
          const { state }: Octet = octet({
              max,
              min,
              seed,
              count: firstExpectedLength,
            }),
            { generated }: Octet = octet({
              max,
              min,
              state,
              count: firstExpectedLength,
              drop: 0,
            })

          it('should return known octets from a loaded state', () => {
            expect(generated).toEqual(secondExpected)
          })
        })
      })

      describe(`stochastic`, () => {
        const stochasticPair = async (): Promise<[number, number]> => {
          const single = (): number => octet({ max, min }).generated[0]
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
})
