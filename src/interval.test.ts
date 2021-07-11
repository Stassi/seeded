import type { Cipher } from './cipher'
import delayTen from './utilities/delayTen'
import interval from './interval'
import length from './utilities/length'

describe('interval', () => {
  describe.each([
    {
      expected: [
        [
          -0.9046954632726754, -0.710916825147871, -0.3812268602640425,
          -0.7832726021920098, -0.6486367459534348,
        ],
        [
          -0.3118447642187867, -0.7954158330225121, -0.9393768939747715,
          -0.477450172615679, -0.1456162083209087,
        ],
      ],
      max: 0,
      min: -1,
    },
    {
      expected: [
        [
          0.09530453672732464, 0.289083174852129, 0.6187731397359575,
          0.21672739780799022, 0.3513632540465652,
        ],
        [
          0.6881552357812133, 0.20458416697748794, 0.06062310602522847,
          0.522549827384321, 0.8543837916790913,
        ],
      ],
      max: 1,
      min: 0,
    },
    {
      expected: [
        [
          0.09530453672732464, 0.289083174852129, 0.6187731397359575,
          0.21672739780799022, 0.3513632540465652,
        ],
        [
          0.6881552357812133, 0.20458416697748794, 0.06062310602522847,
          0.522549827384321, 0.8543837916790913,
        ],
      ],
      max: undefined,
      min: undefined,
    },
    {
      expected: [
        [
          -0.40469546327267536, -0.21091682514787102, 0.11877313973595749,
          -0.2832726021920098, -0.1486367459534348,
        ],
        [
          0.1881552357812133, -0.29541583302251206, -0.43937689397477153,
          0.022549827384320986, 0.3543837916790913,
        ],
      ],
      max: 0.5,
      min: -0.5,
    },
    {
      expected: [
        [
          -9.904695463272676, -9.710916825147871, -9.381226860264043,
          -9.78327260219201, -9.648636745953436,
        ],
        [
          -9.311844764218787, -9.795415833022512, -9.93937689397477,
          -9.47745017261568, -9.14561620832091,
        ],
      ],
      max: -9,
      min: -10,
    },
    {
      expected: [
        [
          9.095304536727324, 9.289083174852129, 9.618773139735957,
          9.21672739780799, 9.351363254046564,
        ],
        [
          9.688155235781213, 9.204584166977488, 9.06062310602523,
          9.52254982738432, 9.85438379167909,
        ],
      ],
      max: 10,
      min: 9,
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
          const { generated, next: nextInterval }: Cipher = interval({
            max,
            min,
            seed,
            count: firstExpectedLength,
          })

          it('should persistently return known intervals', () => {
            expect(generated).toEqual(firstExpected)
          })

          describe('second chained call', () => {
            it('should persistently return known intervals', () => {
              const { generated: generatedTwo }: Cipher =
                nextInterval(firstExpectedLength)
              expect(generatedTwo).toEqual(secondExpected)
            })
          })
        })

        describe('composite call', () => {
          it('should persistently return known intervals', () => {
            const { generated }: Cipher = interval({
              max,
              min,
              seed,
              count: expectedLength,
            })

            expect(generated).toEqual(expected)
          })
        })

        describe('state loading', () => {
          const { state }: Cipher = interval({
              max,
              min,
              seed,
              count: firstExpectedLength,
            }),
            { generated }: Cipher = interval({
              max,
              min,
              state,
              count: firstExpectedLength,
              drop: 0,
            })

          it('should return known intervals from a loaded state', () => {
            expect(generated).toEqual(secondExpected)
          })
        })
      })

      describe(`stochastic`, () => {
        const stochasticPair = async (): Promise<[number, number]> => {
          const single = (): number => interval({ max, min }).generated[0]
          const x: number = single()
          await delayTen()
          const y: number = single()
          return [x, y]
        }

        describe('multiple instances', () => {
          it('should return distinct values', async () => {
            const [x, y]: [number, number] = await stochasticPair()
            expect(x === y).toBeFalsy()
          })

          it('should return continuous values within specified range', async () => {
            const [x, y]: [number, number] = await stochasticPair()
            expect(x).toBeGreaterThanOrEqual(min || 0)
            expect(x).toBeLessThan(max || 1)
            expect(y).toBeGreaterThanOrEqual(min || 0)
            expect(y).toBeLessThan(max || 1)
          })
        })
      })
    }
  )
})
