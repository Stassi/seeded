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

    describe('generic call and next call', () => {
      const { generated, next: nextOctet }: Octet = octet({
        seed,
        count: keyWidth,
      })

      test('it should persistently return a known key', () => {
        expect(generated).toEqual(knownKey)
      })

      describe('next call', () => {
        test('it should persistently return a known key', () => {
          const { generated: generatedTwo } = nextOctet({ count: keyWidth })
          expect(generatedTwo).toEqual(nextKnownKey)
        })
      })
    })
  })
})
