import arcSeed, { ArcSeed } from './arcSeed'

describe('arcSeed', () => {
  const seed: string = 'hello.',
    knownKey: number[] = [84, 98, 80, 93, 113],
    nextKnownKey: number[] = [153, 235, 47, 95, 31],
    compositeKey: number[] = [...knownKey, ...nextKnownKey],
    keyWidth: number = 5,
    doubleKeyWidth: number = keyWidth * 2

  describe(`seed (deterministic): "${seed}"`, () => {
    describe('#keyStream', () => {
      const { keyStream }: ArcSeed = arcSeed({ seed })

      describe(`keyWidth: ${keyWidth}`, () => {
        describe('Generic call', () => {
          test(`it should persistently return a known, ${keyWidth}-length key: [${knownKey}]`, () => {
            expect(keyStream(keyWidth).key).toEqual(knownKey)
          })
        })

        describe('Repeat of generic call and next call', () => {
          const {
            key,
            next: { keyStream: nextKeyStream },
          } = keyStream(keyWidth)

          test(`it should persistently return a known, ${keyWidth}-length key: [${knownKey}]`, () => {
            expect(key).toEqual(knownKey)
          })

          describe('Next call', () => {
            test(`it should persistently return a known, ${keyWidth}-length key: [${nextKnownKey}]`, () => {
              expect(nextKeyStream(keyWidth).key).toEqual(nextKnownKey)
            })
          })
        })

        describe('Composite call', () => {
          test(`it should persistently return a known, ${doubleKeyWidth}-length key: [${compositeKey}]`, () => {
            expect(keyStream(doubleKeyWidth).key).toEqual(compositeKey)
          })
        })
      })
    })

    describe('state', () => {
      const {
        next: { state: savedState },
      } = arcSeed({ seed }).keyStream(keyWidth)

      describe('Next key loaded from saved state', () => {
        const { keyStream: nextKeyStream } = arcSeed({
          seed,
          state: savedState,
        })

        test(`it should persistently return a known, ${keyWidth}-length key: [${nextKnownKey}]`, () => {
          expect(nextKeyStream(keyWidth).key).toEqual(nextKnownKey)
        })
      })
    })
  })
})
