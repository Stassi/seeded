import type { Interval } from './interval'
import delayTen from './utilities/delayTen'
import interval from './interval'

describe('interval', () => {
  describe.each([
    {
      knownIntervals: [
        -0.9046954632726754, -0.710916825147871, -0.3812268602640425,
        -0.7832726021920098, -0.6486367459534348,
      ],
      max: 0,
      min: -1,
      nextKnownIntervals: [
        -0.3118447642187867, -0.7954158330225121, -0.9393768939747715,
        -0.477450172615679, -0.1456162083209087,
      ],
    },
    {
      knownIntervals: [
        0.09530453672732464, 0.289083174852129, 0.6187731397359575,
        0.21672739780799022, 0.3513632540465652,
      ],
      max: 1,
      min: 0,
      nextKnownIntervals: [
        0.6881552357812133, 0.20458416697748794, 0.06062310602522847,
        0.522549827384321, 0.8543837916790913,
      ],
    },
    {
      knownIntervals: [
        -0.40469546327267536, -0.21091682514787102, 0.11877313973595749,
        -0.2832726021920098, -0.1486367459534348,
      ],
      max: 0.5,
      min: -0.5,
      nextKnownIntervals: [
        0.1881552357812133, -0.29541583302251206, -0.43937689397477153,
        0.022549827384320986, 0.3543837916790913,
      ],
    },
    {
      knownIntervals: [
        -9.904695463272676, -9.710916825147871, -9.381226860264043,
        -9.78327260219201, -9.648636745953436,
      ],
      max: -9,
      min: -10,
      nextKnownIntervals: [
        -9.311844764218787, -9.795415833022512, -9.93937689397477,
        -9.47745017261568, -9.14561620832091,
      ],
    },
    {
      knownIntervals: [
        9.095304536727324, 9.289083174852129, 9.618773139735957,
        9.21672739780799, 9.351363254046564,
      ],
      max: 10,
      min: 9,
      nextKnownIntervals: [
        9.688155235781213, 9.204584166977488, 9.06062310602523,
        9.52254982738432, 9.85438379167909,
      ],
    },
  ])(
    'range: [$min, $max)',
    ({
      knownIntervals,
      max,
      min,
      nextKnownIntervals,
    }: {
      knownIntervals: number[]
      max: number
      min: number
      nextKnownIntervals: number[]
    }) => {
      describe(`deterministic`, () => {
        const seed: string = 'hello.',
          keyWidth: number = 5,
          doubleKeyWidth: number = keyWidth * 2,
          compositeIntervals: number[] = [
            ...knownIntervals,
            ...nextKnownIntervals,
          ]

        describe('first chained call', () => {
          const { generated, next: nextInterval }: Interval = interval({
            max,
            min,
            seed,
            count: keyWidth,
          })

          test('it should persistently return known intervals', () => {
            expect(generated).toEqual(knownIntervals)
          })

          describe('second chained call', () => {
            test('it should persistently return known intervals', () => {
              const { generated: generatedTwo }: Interval =
                nextInterval(keyWidth)
              expect(generatedTwo).toEqual(nextKnownIntervals)
            })
          })
        })

        describe('composite call', () => {
          test('it should persistently return known intervals', () => {
            const { generated }: Interval = interval({
              max,
              min,
              seed,
              count: doubleKeyWidth,
            })

            expect(generated).toEqual(compositeIntervals)
          })
        })

        describe('state loading', () => {
          const { state }: Interval = interval({
              max,
              min,
              seed,
              count: keyWidth,
            }),
            { generated }: Interval = interval({
              max,
              min,
              state,
              count: keyWidth,
              drop: 0,
            })

          test('it should return known intervals from a loaded state', () => {
            expect(generated).toEqual(nextKnownIntervals)
          })
        })
      })

      describe(`stochastic`, () => {
        describe('multiple instances', () => {
          test('it should return distinct values', async () => {
            const {
              generated: [x],
            } = interval({ max, min })

            await delayTen()

            const {
              generated: [y],
            } = interval({ max, min })

            expect(x === y).toBeFalsy()
          })

          test('it should return continuous values within allowed range', async () => {
            const {
              generated: [x],
            } = interval({ max, min })

            await delayTen()

            const {
              generated: [y],
            } = interval({ max, min })

            expect(x).toBeGreaterThanOrEqual(min)
            expect(x).toBeLessThan(max)
            expect(y).toBeGreaterThanOrEqual(min)
            expect(y).toBeLessThan(max)
          })
        })
      })
    }
  )
})
