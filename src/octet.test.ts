import type { Octet } from './octet'
import octet from './octet'

describe('octet', () => {
  describe(`deterministic`, () => {
    const seed: string = 'hello.',
      keyWidth: number = 5,
      doubleKeyWidth: number = keyWidth * 2,
      knownKey: number[] = [113, 134, 94, 12, 198],
      nextKnownKey: number[] = [119, 249, 116, 160, 21],
      compositeKey: number[] = [...knownKey, ...nextKnownKey]

    describe('first chained call', () => {
      const { generated, next: nextOctet }: Octet = octet({
        seed,
        count: keyWidth,
      })

      test('it should persistently return a known key', () => {
        expect(generated).toEqual(knownKey)
      })

      describe('second chained call', () => {
        test('it should persistently return a known key', () => {
          const { generated: generatedTwo }: Octet = nextOctet(keyWidth)
          expect(generatedTwo).toEqual(nextKnownKey)
        })
      })
    })

    describe('composite call', () => {
      test('it should persistently return a known key', () => {
        const { generated }: Octet = octet({
          seed,
          count: doubleKeyWidth,
        })

        expect(generated).toEqual(compositeKey)
      })
    })

    describe('state loading', () => {
      const { state }: Octet = octet({
          seed,
          count: keyWidth,
        }),
        { generated }: Octet = octet({
          state,
          count: keyWidth,
          drop: 0,
        })

      test('it should return a known key from a loaded state', () => {
        expect(generated).toEqual(nextKnownKey)
      })
    })
  })
})
