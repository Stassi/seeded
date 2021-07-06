import type { Integer } from './integer'
import delay from './utilities/delay'
import integer from './integer'
import { bitsInOctet, poolWidth } from './integers.json'

describe('integer', () => {
  describe(`deterministic`, () => {
    describe(`max: ${bitsInOctet}`, () => {
      const max: number = bitsInOctet,
        seed: string = 'hello.',
        keyWidth: number = 5,
        doubleKeyWidth: number = keyWidth * 2,
        knownIntegers: number[] = [1, 6, 6, 4, 6],
        nextKnownIntegers: number[] = [7, 1, 4, 0, 5],
        compositeIntegers: number[] = [...knownIntegers, ...nextKnownIntegers]

      describe('first chained call', () => {
        const { generated, next: nextInteger }: Integer = integer({
          max,
          seed,
          count: keyWidth,
        })

        test('it should persistently return known integers', () => {
          expect(generated).toEqual(knownIntegers)
        })

        describe('second chained call', () => {
          test('it should persistently return known integers', () => {
            const { generated: generatedTwo }: Integer = nextInteger(keyWidth)
            expect(generatedTwo).toEqual(nextKnownIntegers)
          })
        })
      })

      describe('composite call', () => {
        test('it should persistently return known integers', () => {
          const { generated }: Integer = integer({
            max,
            seed,
            count: doubleKeyWidth,
          })

          expect(generated).toEqual(compositeIntegers)
        })
      })

      describe('state loading', () => {
        const { state }: Integer = integer({
            max,
            seed,
            count: keyWidth,
          }),
          { generated }: Integer = integer({
            max,
            state,
            count: keyWidth,
            drop: 0,
          })

        test('it should return known integers from a loaded state', () => {
          expect(generated).toEqual(nextKnownIntegers)
        })
      })
    })

    describe(`max: ${poolWidth}`, () => {
      const max: number = poolWidth,
        seed: string = 'hello.',
        keyWidth: number = 5,
        doubleKeyWidth: number = keyWidth * 2,
        knownIntegers: number[] = [113, 134, 94, 12, 198],
        nextKnownIntegers: number[] = [119, 249, 116, 160, 21],
        compositeIntegers: number[] = [...knownIntegers, ...nextKnownIntegers]

      describe('first chained call', () => {
        const { generated, next: nextInteger }: Integer = integer({
          max,
          seed,
          count: keyWidth,
        })

        test('it should persistently return known integers', () => {
          expect(generated).toEqual(knownIntegers)
        })

        describe('second chained call', () => {
          test('it should persistently return known integers', () => {
            const { generated: generatedTwo }: Integer = nextInteger(keyWidth)
            expect(generatedTwo).toEqual(nextKnownIntegers)
          })
        })
      })

      describe('composite call', () => {
        test('it should persistently return known integers', () => {
          const { generated }: Integer = integer({
            max,
            seed,
            count: doubleKeyWidth,
          })

          expect(generated).toEqual(compositeIntegers)
        })
      })

      describe('state loading', () => {
        const { state }: Integer = integer({
            max,
            seed,
            count: keyWidth,
          }),
          { generated }: Integer = integer({
            max,
            state,
            count: keyWidth,
            drop: 0,
          })

        test('it should return known integers from a loaded state', () => {
          expect(generated).toEqual(nextKnownIntegers)
        })
      })
    })

    describe('max: 1000', () => {
      const max: number = 1000,
        seed: string = 'hello.',
        keyWidth: number = 5,
        doubleKeyWidth: number = keyWidth * 2,
        knownIntegers: number[] = [0, 1, 2, 3, 4],
        nextKnownIntegers: number[] = [5, 6, 7, 8, 9],
        compositeIntegers: number[] = [...knownIntegers, ...nextKnownIntegers]

      describe('first chained call', () => {
        const { generated, next: nextInteger }: Integer = integer({
          max,
          seed,
          count: keyWidth,
        })

        test('it should persistently return known integers', () => {
          expect(generated).toEqual(knownIntegers)
        })

        describe('second chained call', () => {
          test('it should persistently return known integers', () => {
            const { generated: generatedTwo }: Integer = nextInteger(keyWidth)
            expect(generatedTwo).toEqual(nextKnownIntegers)
          })
        })
      })

      describe('composite call', () => {
        test('it should persistently return known integers', () => {
          const { generated }: Integer = integer({
            max,
            seed,
            count: doubleKeyWidth,
          })

          expect(generated).toEqual(compositeIntegers)
        })
      })

      describe('state loading', () => {
        const { state }: Integer = integer({
            max,
            seed,
            count: keyWidth,
          }),
          { generated }: Integer = integer({
            max,
            state,
            count: keyWidth,
            drop: 0,
          })

        test('it should return known integers from a loaded state', () => {
          expect(generated).toEqual(nextKnownIntegers)
        })
      })
    })
  })

  describe(`stochastic`, () => {
    describe('multiple instances', () => {
      test('it should return distinct values', async () => {
        const {
          generated: [x],
        }: Integer = integer()

        await delay(100)

        const {
          generated: [y],
        }: Integer = integer()

        expect(x === y).toBeFalsy()
      })

      test('it should return discrete values between [0, 10)', async () => {
        const {
          generated: [x],
        }: Integer = integer()

        await delay(1)

        const {
          generated: [y],
        }: Integer = integer()

        expect(x).toBeGreaterThanOrEqual(0)
        expect(x).toBeLessThan(10)
        expect(y).toBeGreaterThanOrEqual(0)
        expect(y).toBeLessThan(10)
      })
    })
  })
})
