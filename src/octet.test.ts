import type { Octet } from './octet'
import octet from './octet'

describe('octet', () => {
  describe(`deterministic`, () => {
    const seed: string = 'hello.',
      count: number = 5,
      doubleCount: number = count * 2,
      knownKey: number[] = [113, 134, 94, 12, 198],
      nextKnownKey: number[] = [119, 249, 116, 160, 21],
      compositeKey: number[] = [...knownKey, ...nextKnownKey]

    describe('first chained call', () => {
      const { generated, next: nextOctet }: Octet = octet({ count, seed })

      test('it should persistently return a known key', () => {
        expect(generated).toEqual(knownKey)
      })

      describe('second chained call', () => {
        test('it should persistently return a known key', () => {
          const { generated: generatedTwo }: Octet = nextOctet(count)
          expect(generatedTwo).toEqual(nextKnownKey)
        })
      })
    })

    describe('composite call', () => {
      test('it should persistently return a known key', () => {
        const { generated }: Octet = octet({ seed, count: doubleCount })

        expect(generated).toEqual(compositeKey)
      })
    })

    describe('state loading', () => {
      const { state }: Octet = octet({ count, seed }),
        { generated }: Octet = octet({ count, state, drop: 0 })

      test('it should return a known key from a loaded state', () => {
        expect(generated).toEqual(nextKnownKey)
      })
    })
  })

  describe('stochastic', () => {
    describe('multiple instances', () => {
      const {
          generated: [x],
        } = octet(),
        {
          generated: [y],
        } = octet()

      test('it should return distinct values', () => {
        expect(x === y).toBeFalsy()
      })

      test('it should return discrete integers between [0, 255]', () => {
        expect(x).toBeGreaterThanOrEqual(0)
        expect(x).toBeLessThanOrEqual(255)
        expect(y).toBeGreaterThanOrEqual(0)
        expect(y).toBeLessThanOrEqual(255)
      })
    })
  })
})
