import type { Interval } from './interval'
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
      compositeInterval: number[] = [...knownIntervals, ...nextKnownIntervals]

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

    describe('composite call', () => {})

    describe('state loading', () => {})
  })

  describe(`stochastic`, () => {})
})
