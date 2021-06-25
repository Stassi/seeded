import cipher, { Cipher, NumbersCipherTuple } from './cipher'

describe('cipher', () => {
  describe(`deterministic`, () => {
    const seed: string = 'hello.',
      keyWidth: number = 5,
      doubleKeyWidth: number = keyWidth * 2

    describe('#interval', () => {
      const knownIntervals: number[] = [
          0.09530453672732464, 0.289083174852129, 0.6187731397359575,
          0.21672739780799022, 0.3513632540465652,
        ],
        nextKnownIntervals: number[] = [
          0.6881552357812133, 0.20458416697748794, 0.06062310602522847,
          0.522549827384321, 0.8543837916790913,
        ],
        compositeInterval: number[] = [
          ...knownIntervals,
          ...nextKnownIntervals,
        ],
        { interval }: Cipher = cipher({ seed })

      describe('Generic call', () => {
        test('it should persistently return known intervals', () => {
          expect(interval(keyWidth)[0]).toEqual(knownIntervals)
        })
      })

      describe('Repeat of generic call and next call', () => {
        const [value, { interval: nextInterval }]: NumbersCipherTuple =
          interval(keyWidth)

        test('it should persistently return known intervals', () => {
          expect(value).toEqual(knownIntervals)
        })

        describe('Next call', () => {
          test('it should persistently return known intervals', () => {
            expect(nextInterval(keyWidth)[0]).toEqual(nextKnownIntervals)
          })
        })
      })

      describe('Composite call', () => {
        test('it should persistently return known intervals', () => {
          expect(interval(doubleKeyWidth)[0]).toEqual(compositeInterval)
        })
      })
    })

    describe('#octet', () => {
      const knownKey: number[] = [113, 134, 94, 12, 198],
        nextKnownKey: number[] = [119, 249, 116, 160, 21],
        compositeKey: number[] = [...knownKey, ...nextKnownKey],
        { octet }: Cipher = cipher({ seed })

      describe('Generic call', () => {
        test(`it should persistently return a known, ${keyWidth}-length key: [${knownKey}]`, () => {
          expect(octet(keyWidth)[0]).toEqual(knownKey)
        })
      })

      describe('Repeat of generic call and next call', () => {
        const [key, { octet: nextOctet }] = octet(keyWidth)

        test(`it should persistently return a known, ${keyWidth}-length key: [${knownKey}]`, () => {
          expect(key).toEqual(knownKey)
        })

        describe('Next call', () => {
          test(`it should persistently return a known, ${keyWidth}-length key: [${nextKnownKey}]`, () => {
            expect(nextOctet(keyWidth)[0]).toEqual(nextKnownKey)
          })
        })
      })

      describe('Composite call', () => {
        test(`it should persistently return a known, ${doubleKeyWidth}-length key: [${compositeKey}]`, () => {
          expect(octet(doubleKeyWidth)[0]).toEqual(compositeKey)
        })
      })

      describe('state', () => {
        const [, { state: savedState }] = cipher({ seed }).octet(keyWidth)

        describe('Next key loaded from saved state', () => {
          const { octet: nextOctet } = cipher({
            seed,
            drop: 0,
            state: savedState,
          })

          test(`it should persistently return a known, ${keyWidth}-length key: [${nextKnownKey}]`, () => {
            expect(nextOctet(keyWidth)[0]).toEqual(nextKnownKey)
          })
        })
      })
    })
  })

  describe('stochastic', () => {
    describe('#interval', () => {
      const { interval }: Cipher = cipher({ seed: 'hello.' })

      describe('Repeated calls', () => {
        const x: number = interval(1)[0][0],
          y: number = interval(1)[0][0]

        test('it should return distinct values', () => {
          expect(x !== y).toBeTruthy()
        })

        test('it should return values between [0, 1)', () => {
          expect(x).toBeGreaterThanOrEqual(0)
          expect(x).toBeLessThan(1)
          expect(y).toBeGreaterThanOrEqual(0)
          expect(y).toBeLessThan(1)
        })
      })
    })
  })
})
