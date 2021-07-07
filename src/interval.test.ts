import type { Interval } from './interval'
import delayTen from './utilities/delayTen'
import interval from './interval'

describe('interval', () => {
  describe('range: [0, 1) (default)', () => {
    describe(`deterministic`, () => {
      const seed: string = 'hello.',
        keyWidth: number = 5,
        doubleKeyWidth: number = keyWidth * 2,
        knownIntervals: number[] = [
          0.09530453672732464, 0.289083174852129, 0.6187731397359575,
          0.21672739780799022, 0.3513632540465652,
        ],
        nextKnownIntervals: number[] = [
          0.6881552357812133, 0.20458416697748794, 0.06062310602522847,
          0.522549827384321, 0.8543837916790913,
        ],
        compositeIntervals: number[] = [
          ...knownIntervals,
          ...nextKnownIntervals,
        ]

      describe('first chained call', () => {
        const { generated, next: nextInterval }: Interval = interval({
          seed,
          count: keyWidth,
        })

        test('it should persistently return known intervals', () => {
          expect(generated).toEqual(knownIntervals)
        })

        describe('second chained call', () => {
          test('it should persistently return known intervals', () => {
            const { generated: generatedTwo }: Interval = nextInterval(keyWidth)
            expect(generatedTwo).toEqual(nextKnownIntervals)
          })
        })
      })

      describe('composite call', () => {
        test('it should persistently return known intervals', () => {
          const { generated }: Interval = interval({
            seed,
            count: doubleKeyWidth,
          })

          expect(generated).toEqual(compositeIntervals)
        })
      })

      describe('state loading', () => {
        const { state }: Interval = interval({
            seed,
            count: keyWidth,
          }),
          { generated }: Interval = interval({
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
          } = interval()

          await delayTen()

          const {
            generated: [y],
          } = interval()

          expect(x === y).toBeFalsy()
        })

        test('it should return continuous values between [0, 1)', async () => {
          const {
            generated: [x],
          } = interval()

          await delayTen()

          const {
            generated: [y],
          } = interval()

          expect(x).toBeGreaterThanOrEqual(0)
          expect(x).toBeLessThan(1)
          expect(y).toBeGreaterThanOrEqual(0)
          expect(y).toBeLessThan(1)
        })
      })
    })
  })

  describe('range: [-1, 1)', () => {
    const min: number = -1,
      max: number = 1

    describe(`deterministic`, () => {
      const seed: string = 'hello.',
        keyWidth: number = 5,
        doubleKeyWidth: number = keyWidth * 2,
        knownIntervals: number[] = [
          -0.8093909265453507, -0.42183365029574205, 0.23754627947191498,
          -0.5665452043840196, -0.2972734919068696,
        ],
        nextKnownIntervals: number[] = [
          0.3763104715624266, -0.5908316660450241, -0.8787537879495431,
          0.04509965476864197, 0.7087675833581826,
        ],
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
            const { generated: generatedTwo }: Interval = nextInterval(keyWidth)
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
  })

  describe('range: [-10, -9)', () => {
    const min: number = -10,
      max: number = -9

    describe(`deterministic`, () => {
      const seed: string = 'hello.',
        keyWidth: number = 5,
        doubleKeyWidth: number = keyWidth * 2,
        knownIntervals: number[] = [
          -9.904695463272676, -9.710916825147871, -9.381226860264043,
          -9.78327260219201, -9.648636745953436,
        ],
        nextKnownIntervals: number[] = [
          -9.311844764218787, -9.795415833022512, -9.93937689397477,
          -9.47745017261568, -9.14561620832091,
        ],
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
            const { generated: generatedTwo }: Interval = nextInterval(keyWidth)
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
  })
})
