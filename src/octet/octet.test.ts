import type { Octet } from './octet'
import delayTen from '../utilities/delayTen'
import octet from './octet'

describe('octet', () => {
  describe(`deterministic`, () => {
    const seed: string = 'hello.',
      count: number = 5,
      doubleCount: number = count * 2,
      knownOctets: number[] = [113, 134, 94, 12, 198],
      nextKnownOctets: number[] = [119, 249, 116, 160, 21],
      compositeOctets: number[] = [...knownOctets, ...nextKnownOctets]

    describe('first chained call', () => {
      const { generated, next: nextOctet }: Octet = octet({ count, seed })

      test('it should persistently return known octets', () => {
        expect(generated).toEqual(knownOctets)
      })

      describe('second chained call', () => {
        test('it should persistently return known octets', () => {
          const { generated: generatedTwo }: Octet = nextOctet(count)
          expect(generatedTwo).toEqual(nextKnownOctets)
        })
      })
    })

    describe('composite call', () => {
      test('it should persistently return known octets', () => {
        const { generated }: Octet = octet({ seed, count: doubleCount })

        expect(generated).toEqual(compositeOctets)
      })
    })

    describe('state loading', () => {
      const { state }: Octet = octet({ count, seed }),
        { generated }: Octet = octet({ count, state, drop: 0 })

      test('it should return known octets from a loaded state', () => {
        expect(generated).toEqual(nextKnownOctets)
      })
    })
  })

  describe('stochastic', () => {
    describe('multiple instances', () => {
      test('it should return distinct values', async () => {
        const {
          generated: [x],
        } = octet()

        await delayTen()

        const {
          generated: [y],
        } = octet()

        expect(x === y).toBeFalsy()
      })

      test('it should return discrete integers between [0, 255]', async () => {
        const {
          generated: [x],
        } = octet()

        await delayTen()

        const {
          generated: [y],
        } = octet()

        expect(x).toBeGreaterThanOrEqual(0)
        expect(x).toBeLessThanOrEqual(255)
        expect(y).toBeGreaterThanOrEqual(0)
        expect(y).toBeLessThanOrEqual(255)
      })
    })
  })
})
