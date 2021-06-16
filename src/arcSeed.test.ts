import arcSeed, { ArcSeed, KeyStream } from './arcSeed'

describe('arcSeed', () => {
  const seed: string = 'hello.',
    knownKey: number[] = [84, 98, 80, 93, 113]

  describe(`seed (deterministic): "${seed}"`, () => {
    describe('#keyStream', () => {
      const keyWidth: number = 5,
        { keyStream }: ArcSeed = arcSeed({ seed }),
        { key }: KeyStream = keyStream(keyWidth)

      describe(`keyWidth: ${keyWidth}`, () => {
        test(`it should return a known, ${keyWidth}-length key: [${knownKey}]`, () => {
          expect(key).toEqual(knownKey)
        })
      })
    })
  })
})
