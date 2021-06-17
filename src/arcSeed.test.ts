import arcSeed, { ArcSeed } from './arcSeed'

describe('arcSeed', () => {
  const seed: string = 'hello.',
    knownKey: number[] = [84, 98, 80, 93, 113]

  describe(`seed (deterministic): "${seed}"`, () => {
    describe('#keyStream', () => {
      const keyWidth: number = 5,
        { keyStream }: ArcSeed = arcSeed({ seed })

      describe(`keyWidth: ${keyWidth}`, () => {
        describe('Call 1/2', () => {
          test(`it should persistently return a known, ${keyWidth}-length key: [${knownKey}]`, () => {
            expect(keyStream(keyWidth).key).toEqual(knownKey)
          })
        })

        describe('Call 2/2', () => {
          test(`it should persistently return a known, ${keyWidth}-length key: [${knownKey}]`, () => {
            expect(keyStream(keyWidth).key).toEqual(knownKey)
          })
        })
      })
    })
  })
})
