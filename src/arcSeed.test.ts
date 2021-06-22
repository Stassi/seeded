import arcSeed, { ArcSeed } from './arcSeed'

describe('arcSeed', () => {
  const seed: string = 'hello.',
    knownIntervals: number[] = [
      0.09530453672732464, 0.289083174852129, 0.6187731397359575,
      0.21672739780799022, 0.3513632540465652,
    ],
    knownKey: number[] = [113, 134, 94, 12, 198],
    nextKnownKey: number[] = [119, 249, 116, 160, 21],
    compositeKey: number[] = [...knownKey, ...nextKnownKey],
    keyWidth: number = 5,
    doubleKeyWidth: number = keyWidth * 2

  describe(`seed (deterministic): "${seed}"`, () => {
    describe('#interval', () => {
      const { interval }: ArcSeed = arcSeed({ seed })

      describe('Generic call', () => {
        test('it should persistently return known intervals', () => {
          expect(interval(keyWidth)[0]).toEqual(knownIntervals)
        })
      })
    })

    describe('#keyStream', () => {
      const { keyStream }: ArcSeed = arcSeed({ seed })

      describe(`keyWidth: ${keyWidth}`, () => {
        describe('Generic call', () => {
          test(`it should persistently return a known, ${keyWidth}-length key: [${knownKey}]`, () => {
            expect(keyStream(keyWidth)[0]).toEqual(knownKey)
          })
        })

        describe('Repeat of generic call and next call', () => {
          const [key, { keyStream: nextKeyStream }] = keyStream(keyWidth)

          test(`it should persistently return a known, ${keyWidth}-length key: [${knownKey}]`, () => {
            expect(key).toEqual(knownKey)
          })

          describe('Next call', () => {
            test(`it should persistently return a known, ${keyWidth}-length key: [${nextKnownKey}]`, () => {
              expect(nextKeyStream(keyWidth)[0]).toEqual(nextKnownKey)
            })
          })
        })

        describe('Composite call', () => {
          test(`it should persistently return a known, ${doubleKeyWidth}-length key: [${compositeKey}]`, () => {
            expect(keyStream(doubleKeyWidth)[0]).toEqual(compositeKey)
          })
        })
      })
    })

    describe('state', () => {
      const [, { state: savedState }] = arcSeed({ seed }).keyStream(keyWidth)

      describe('Next key loaded from saved state', () => {
        const { keyStream: nextKeyStream } = arcSeed({
          seed,
          drop: 0,
          state: savedState,
        })

        test(`it should persistently return a known, ${keyWidth}-length key: [${nextKnownKey}]`, () => {
          expect(nextKeyStream(keyWidth)[0]).toEqual(nextKnownKey)
        })
      })
    })
  })
})
