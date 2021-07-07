import type { Interval } from './interval'
import delayTen from './utilities/delayTen'
import interval from './interval'

describe('interval', () => {
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
      compositeIntervals: number[] = [...knownIntervals, ...nextKnownIntervals]

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
